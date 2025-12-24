import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { AuthGuard } from './../../authentication/guards/auth.guard';
import type { RequestType } from './../../common/interface/request.type';
import { ResponseI } from './../../common/interface/response';
import { Habit } from './entities/habit.entity';
import { ResponseService } from './../../common/services/response.service';
import { PaginationResponse } from './../../common/interface/pagination.response';
import { PaginationQuery } from 'src/common/dtos/pagination.query';
import { FilterHabitDto } from './dto/filter.dto';

@Controller('habits')
@UseGuards(AuthGuard)
export class HabitController {
  constructor(
    private readonly habitService: HabitService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async create(
    @Body() createHabitDto: CreateHabitDto,
    @Request() req: RequestType,
  ): Promise<ResponseI<Habit>> {
    const userId = req.user.id;
    createHabitDto['userId'] = userId;
    const habit = await this.habitService.create(createHabitDto);

    return this.responseService.createResponse(
      HttpStatus.CREATED,
      'Habit created successfully',
      habit,
    );
  }

  @Get()
  async findAll(
    @Query() filter: FilterHabitDto,
    @Query() pagination: PaginationQuery,
    @Request() req: RequestType,
  ): Promise<ResponseI<PaginationResponse<Habit>>> {
    const userId = req.user.id;
    const [habits, total] = await this.habitService.findAll(
      filter,
      pagination,
      userId,
    );

    return this.responseService.createResponse(
      HttpStatus.OK,
      'Habits fetched successfully',
      {
        items: habits,
        pagination: {
          total,
          perPage: pagination.perPage,
          currentPage: pagination.pageNumber,
          numberOfPages: Math.ceil(total / pagination.perPage),
        },
      },
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: RequestType,
  ): Promise<ResponseI<Habit>> {
    const userId = req.user.id;
    const habit = await this.habitService.findOne(id, userId);

    return this.responseService.createResponse(
      HttpStatus.OK,
      'Habit fetched successfully',
      habit,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Request() req: RequestType,
  ): Promise<ResponseI<Habit>> {
    const userId = req.user.id;
    const habit = await this.habitService.update(id, updateHabitDto, userId);

    return this.responseService.createResponse(
      HttpStatus.OK,
      'Habit updated successfully',
      habit,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Request() req: RequestType,
  ): Promise<void> {
    const userId = req.user.id;
    await this.habitService.remove(id, userId);
  }
}
