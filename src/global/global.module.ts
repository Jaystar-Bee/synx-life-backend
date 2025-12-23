import { Global, Module } from '@nestjs/common';
import { MailService } from './../mail/services/mail.service';
import { ResponseService } from 'src/common/services/response.service';
import { AuthGuard } from './../authentication/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [MailService, ResponseService, AuthGuard, JwtService],
  exports: [MailService, ResponseService, AuthGuard, JwtService],
})
export class GlobalModule {}
