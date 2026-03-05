import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private readonly resend: Resend;
    private readonly fromEmail: string;
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is required');
        }
        this.resend = new Resend(apiKey);
        this.fromEmail =
            this.configService.get<string>('RESEND_FROM_EMAIL') ?? 'noreply@apiscout.com';
    }

    async sendOtp(email: string, otp: string, name?: string): Promise<void> {
        const displayName = name ?? 'there';
        const { error } = await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: 'Your ApiScout verification code',
            html: `
<!DOCTYPE html>
<html>
  <body style="font-family: sans-serif; background: #f9f9f9; padding: 40px 0;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #f97316, #ef4444); margin-bottom: 16px;">
          <span style="color: white; font-size: 20px; font-weight: bold;">A</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #111; margin: 0;">ApiScout</h1>
      </div>

      <p style="color: #444; font-size: 16px; margin-bottom: 8px;">Hi ${displayName},</p>
      <p style="color: #444; font-size: 16px; margin-bottom: 32px;">
        Use the code below to verify your email and complete your registration.
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #f4f4f5; border-radius: 12px; padding: 20px 40px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #111;">${otp}</span>
        </div>
      </div>

      <p style="color: #888; font-size: 13px; text-align: center; margin-bottom: 8px;">
        This code expires in <strong>10 minutes</strong>.
      </p>
      <p style="color: #bbb; font-size: 12px; text-align: center;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>`,
        });

        if (error) {
            this.logger.error(`Failed to send OTP email to ${email}: ${error.message}`);
            throw new Error('Failed to send verification email');
        }
    }
}
