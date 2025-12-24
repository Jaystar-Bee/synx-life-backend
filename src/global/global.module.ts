import { Global, Module } from '@nestjs/common';
import { MailService } from './../mail/services/mail.service';
import { ResponseService } from './../common/services/response.service';
import { AuthGuard } from './../authentication/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../authentication/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../authentication/user/user.entity';
import { NotificationService } from './../common/services/notification/notification.service';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    MailService,
    ResponseService,
    AuthGuard,
    JwtService,
    UserService,
    NotificationService,
  ],
  exports: [
    MailService,
    ResponseService,
    AuthGuard,
    JwtService,
    UserService,
    NotificationService,
  ],
})
export class GlobalModule {}
