import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthConfig } from './auth.config';
import { AppConfig } from './app.config';
import { MailConfig } from './mail.config';

export interface ConfigType {
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
  app: AppConfig;
  mail: MailConfig;
}
