import { Global, Module } from '@nestjs/common';
import { MailService } from './../mail/services/mail.service';
import { ResponseService } from 'src/common/services/response.service';

@Global()
@Module({
  providers: [MailService, ResponseService],
  exports: [MailService, ResponseService],
})
export class GlobalModule {}
