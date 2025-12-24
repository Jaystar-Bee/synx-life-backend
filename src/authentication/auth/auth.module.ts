import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from './../../config/config.type';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<ConfigType>,
      ): JwtModuleOptions => ({
        secret: configService.get('auth').jwt.secret,
        signOptions: {
          expiresIn: configService.get('auth').jwt.expiresIn,
        },
      }),
    }),
  ],
  providers: [AuthService, HashService, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
