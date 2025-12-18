import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configShema from './config/config.shema';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigType } from './config/config.type';
import { AuthModule } from './authentication/auth/auth.module';
import { databaseConfig } from './config/database.config';
import { HashService } from './authentication/hash/hash.service';
import { authConfig } from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configShema,
      load: [databaseConfig, authConfig],
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<ConfigType>,
      ): TypeOrmModuleOptions => ({
        ...configService.get('database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, HashService],
})
export class AppModule {}
