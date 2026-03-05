import { Controller, Post, Get, Body, UseGuards, Request, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, InitiateSignupDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
};

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Step 1 — Validate signup data, store in Redis, send OTP email.
     * The user is NOT created in the database at this point.
     */
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @Post('initiate-signup')
    initiateSignup(@Body() dto: InitiateSignupDto) {
        return this.authService.initiateSignup(dto.email, dto.password, dto.name);
    }

    /**
     * Step 2 — Verify the OTP. Creates the user in the database and
     * returns a JWT on success (set as httpOnly cookie).
     */
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @Post('verify-otp')
    async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.verifyOtp(dto.email, dto.otp);
        const refreshToken = await this.authService.generateRefreshToken(
            result.user.id, result.user.email, result.user.role,
        );
        res.cookie('apiscout_token', result.access_token, ACCESS_COOKIE_OPTIONS);
        res.cookie('apiscout_refresh', refreshToken, REFRESH_COOKIE_OPTIONS);
        return result;
    }

    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(dto.email, dto.password);
        const refreshToken = await this.authService.generateRefreshToken(
            result.user.id, result.user.email, result.user.role,
        );
        res.cookie('apiscout_token', result.access_token, ACCESS_COOKIE_OPTIONS);
        res.cookie('apiscout_refresh', refreshToken, REFRESH_COOKIE_OPTIONS);
        return result;
    }

    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @Post('refresh')
    async refresh(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const oldRefresh = req.cookies?.apiscout_refresh;
        if (!oldRefresh) {
            res.status(401);
            return { message: 'No refresh token' };
        }
        const result = await this.authService.refresh(oldRefresh);
        res.cookie('apiscout_token', result.access_token, ACCESS_COOKIE_OPTIONS);
        res.cookie('apiscout_refresh', result.refresh_token, REFRESH_COOKIE_OPTIONS);
        return { access_token: result.access_token };
    }

    @Post('logout')
    async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.apiscout_refresh;
        await this.authService.revokeRefreshToken(refreshToken);
        res.clearCookie('apiscout_token', { path: '/' });
        res.clearCookie('apiscout_refresh', { path: '/api/auth' });
        return { message: 'Logged out' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.sub);
    }
}
