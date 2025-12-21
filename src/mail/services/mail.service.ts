import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(
    to: string,
    name: string,
    otp: string,
    year: string,
    appName: string,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to My App 🎉',
      template: 'otp',
      context: {
        name,
        otp,
        year,
        appName,
      },
    });
  }
}
