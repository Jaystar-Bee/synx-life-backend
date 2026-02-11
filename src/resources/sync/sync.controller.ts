import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import type { RequestType } from 'src/common/interface/request.type';
import { AuthGuard } from 'src/authentication/guards/auth.guard';
import { SyncDto } from './dto/sync.dto';
import { ResponseService } from 'src/common/services/response.service';

@Controller('sync')
@UseGuards(AuthGuard)
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  public async sync(@Request() req: RequestType, @Body() syncDto: SyncDto) {
    const userId = req?.user?.id;
    const result = await this.syncService.sync(userId, syncDto);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Synced successfully',
      result,
    );
  }
}
