import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export interface AppConfig {
  otpValidityTime: StringValue;
  appName: string;
}

export const appConfig = registerAs('app', () => ({
  otpValidityTime: process.env.OTP_VALIDITY_TIME,
  appName: process.env.APP_NAME,
}));
