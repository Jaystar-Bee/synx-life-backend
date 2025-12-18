import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthConfig } from './auth.config';

export interface ConfigType {
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
}
