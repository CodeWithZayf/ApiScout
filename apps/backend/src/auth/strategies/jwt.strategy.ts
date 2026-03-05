import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

function extractJwtFromCookieOrHeader(req: Request): string | null {
    // Try cookie first, then fall back to Authorization header
    const fromCookie = req?.cookies?.apiscout_token;
    if (fromCookie) return fromCookie;
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
        super({
            jwtFromRequest: extractJwtFromCookieOrHeader,
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: { sub: string; email: string; role: string }) {
        return { sub: payload.sub, email: payload.email, role: payload.role };
    }
}
