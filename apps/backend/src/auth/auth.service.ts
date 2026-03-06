import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const OTP_TTL_SECONDS = 600; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;
const OTP_COOLDOWN_SECONDS = 60;
const SIGNUP_KEY = (email: string) => `signup:${email}`;
const COOLDOWN_KEY = (email: string) => `signup-cooldown:${email}`;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redis: RedisService,
        private mail: MailService,
    ) { }

    // ── Step 1: Validate → hash password → store in Redis → send OTP ──
    async initiateSignup(email: string, password: string, name?: string) {
        // Per-email cooldown: 1 OTP per 60 seconds
        const cooldown = await this.redis.get(COOLDOWN_KEY(email));
        if (cooldown) {
            throw new BadRequestException('Please wait before requesting another OTP.');
        }

        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = String(crypto.randomInt(100000, 999999));

        await this.redis.set(
            SIGNUP_KEY(email),
            JSON.stringify({ hashedPassword, name, otp, attempts: 0 }),
            OTP_TTL_SECONDS,
        );

        // Set cooldown to prevent email bombing
        await this.redis.set(COOLDOWN_KEY(email), '1', OTP_COOLDOWN_SECONDS);

        await this.mail.sendOtp(email, otp, name);

        return { message: 'OTP sent to your email address' };
    }

    // ── Step 2: Verify OTP → create user in DB → return JWT ──────────
    async verifyOtp(email: string, otp: string) {
        const raw = await this.redis.get(SIGNUP_KEY(email));
        if (!raw) {
            throw new BadRequestException('OTP expired or not found. Please sign up again.');
        }

        const payload = JSON.parse(raw) as {
            hashedPassword: string;
            name?: string;
            otp: string;
            attempts: number;
        };

        // Brute-force protection: lock out after MAX_OTP_ATTEMPTS failures
        if (payload.attempts >= MAX_OTP_ATTEMPTS) {
            await this.redis.del(SIGNUP_KEY(email));
            throw new BadRequestException('Too many failed attempts. Please sign up again.');
        }

        if (payload.otp !== otp) {
            payload.attempts += 1;
            await this.redis.set(SIGNUP_KEY(email), JSON.stringify(payload), OTP_TTL_SECONDS);
            const remaining = MAX_OTP_ATTEMPTS - payload.attempts;
            throw new BadRequestException(
                remaining > 0
                    ? `Invalid OTP. ${remaining} attempt(s) remaining.`
                    : 'Too many failed attempts. Please sign up again.',
            );
        }

        // OTP is valid — create the user now
        const user = await this.prisma.user.create({
            data: {
                email,
                password: payload.hashedPassword,
                name: payload.name,
            },
        });

        // Clean up Redis key immediately
        await this.redis.del(SIGNUP_KEY(email));

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
            },
            access_token: token,
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
            },
            access_token: token,
        };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                createdAt: true,
                _count: {
                    select: {
                        bookmarks: true,
                        reviews: true,
                        submissions: true,
                    },
                },
            },
        });

        return user;
    }

    async updateProfile(userId: string, dto: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Require current password when changing email or password
        if (dto.email || dto.newPassword) {
            if (!dto.currentPassword) {
                throw new BadRequestException('Current password is required to change email or password');
            }
            if (!user.password) {
                throw new BadRequestException('Cannot change password for OAuth accounts');
            }
            const valid = await bcrypt.compare(dto.currentPassword, user.password);
            if (!valid) {
                throw new BadRequestException('Current password is incorrect');
            }
        }

        const data: any = {};

        if (dto.name !== undefined) {
            data.name = dto.name;
        }

        if (dto.email && dto.email !== user.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (existing) {
                throw new ConflictException('Email already in use');
            }
            data.email = dto.email;
        }

        if (dto.newPassword) {
            data.password = await bcrypt.hash(dto.newPassword, 10);
        }

        if (Object.keys(data).length === 0) {
            return this.getProfile(userId);
        }

        await this.prisma.user.update({ where: { id: userId }, data });
        return this.getProfile(userId);
    }

    async refresh(refreshToken: string) {
        const key = `refresh:${refreshToken}`;
        const raw = await this.redis.get(key);
        if (!raw) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const { userId, email, role } = JSON.parse(raw);

        // Rotate: delete old refresh token, issue new pair
        await this.redis.del(key);

        const accessToken = this.generateToken(userId, email, role);
        const newRefreshToken = await this.generateRefreshToken(userId, email, role);

        return { access_token: accessToken, refresh_token: newRefreshToken };
    }

    async revokeRefreshToken(refreshToken: string) {
        if (refreshToken) {
            await this.redis.del(`refresh:${refreshToken}`);
        }
    }

    private generateToken(userId: string, email: string, role: string): string {
        return this.jwtService.sign({
            sub: userId,
            email,
            role,
        });
    }

    async generateRefreshToken(userId: string, email: string, role: string): Promise<string> {
        const token = crypto.randomBytes(32).toString('hex');
        await this.redis.set(
            `refresh:${token}`,
            JSON.stringify({ userId, email, role }),
            7 * 24 * 60 * 60, // 7 days
        );
        return token;
    }
}
