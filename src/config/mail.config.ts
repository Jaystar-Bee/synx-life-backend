import { registerAs } from '@nestjs/config';

export interface MailConfig {
  mailHost: string;
  mailPort: number;
  mailUser: string;
  mailPassword: string;
  mailSecure: boolean;
}

export const mailConfig = registerAs(
  'mail',
  (): MailConfig => ({
    mailHost: process.env.MAIL_HOST ?? '',
    mailPort: Number(process.env.MAIL_PORT),
    mailUser: process.env.MAIL_USER ?? '',
    mailPassword: process.env.MAIL_PASSWORD ?? '',
    mailSecure: Boolean(process.env.MAIL_SECURE ?? false),
  }),
);
