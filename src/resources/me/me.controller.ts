import {
  Controller,
  Query,
  UseGuards,
  Request,
  Get,
  HttpStatus,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { MeService } from './me.service';
import { AuthGuard } from './../../authentication/guards/auth.guard';
import type { RequestType } from './../../common/interface/request.type';
import { TodayFilterDto } from './dto/today-filter.dto';
import { ResponseService } from './../../common/services/response.service';
import { ResponseI } from './../../common/interface/response';
import { User } from './../../authentication/user/user.entity';
import { HabitI } from '../habit/habit.model';
import { Task } from '../tasks/entities/task.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiBearerAuth()
@Controller('me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  async me(@Request() req: RequestType): Promise<ResponseI<User>> {
    const userId = req.user.id;
    const user = await this.meService.getMe(userId);

    return this.responseService.createResponse(
      HttpStatus.OK,
      'User fetched successfully',
      user,
    );
  }

  @Get('tasks-and-habits-per-day')
  async dayTasksAndHabits(
    @Request() req: RequestType,
    @Query() filter: TodayFilterDto,
  ): Promise<
    ResponseI<{
      habits: [HabitI[], number];
      tasks: [Task[], number];
    }>
  > {
    const userId = req.user.id;
    const result = await this.meService.getDayTasksAndHabits(userId, filter);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Tasks and habits fetched successfully',
      result,
    );
  }

  @Get('lower-attended-habits')
  async lowerAttendedHabits(
    @Request() req: RequestType,
  ): Promise<ResponseI<HabitI>> {
    const userId = req.user?.id;
    const result = await this.meService.getLowerAttendedHabits(userId);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Lower attended habits fetched successfully',
      result,
    );
  }

  @Get('consistency-heat')
  async consistencyHeat(@Request() req: RequestType) {
    const userId = req.user?.id;
    const result = await this.meService.getConsistencyHeat(userId);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Consistency heat fetched successfully',
      result,
    );
  }

  // Delete Account
  @Delete()
  public async deleteUser(
    @Request() req: RequestType,
  ): Promise<ResponseI<null>> {
    const userId = req.user?.id;
    await this.meService.deleteAccount(userId);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Account deleted successfully',
      null,
    );
  }

  // Change Password
  @Post('change-password')
  public async changePassword(
    @Request() req: RequestType,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseI<null>> {
    const userId = req.user?.id;
    await this.meService.changePassword(userId, changePasswordDto);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Password Changes Successfully',
      null,
    );
  }
}
