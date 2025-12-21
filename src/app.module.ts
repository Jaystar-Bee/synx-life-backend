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
import { appConfig } from './config/app.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { mailConfig } from './config/mail.config';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configShema,
      load: [databaseConfig, authConfig, appConfig, mailConfig],
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        transport: {
          host: configService.get('mail').mailHost,
          port: configService.get('mail').mailPort,
          secure: configService.get('mail').mailSecure,
          auth: {
            user: configService.get('mail').mailUser,
            pass: configService.get('mail').mailPassword,
          },
        },
        defaults: {
          from: configService.get('app').appName,
        },
        template: {
          dir: join(process.cwd(), 'dist', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AuthModule,
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService, HashService],
})
export class AppModule {}
