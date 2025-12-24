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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from './../../authentication/guards/auth.guard';
import type { RequestType } from './../../common/interface/request.type';
import { ResponseI } from './../../common/interface/response';
import { Task } from './entities/task.entity';
import { ResponseService } from './../../common/services/response.service';
import { FilterTaskDto } from './dto/filter.dto';
import { PaginationQuery } from './../../common/dtos/pagination.query';
import { PaginationResponse } from 'src/common/interface/pagination.response';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestType,
  ): Promise<ResponseI<Task>> {
    const userId = req.user.id;
    createTaskDto['userId'] = userId;
    const task = await this.tasksService.create(createTaskDto);
    return this.responseService.createResponse(
      HttpStatus.CREATED,
      'Task created successfully',
      task,
    );
  }

  @Get()
  async findAll(
    @Request() req: RequestType,
    @Query() filter: FilterTaskDto,
    @Query() pagination: PaginationQuery,
  ): Promise<ResponseI<PaginationResponse<Task>>> {
    const userId = req.user.id;
    const [tasks, total] = await this.tasksService.findAll(
      userId,
      filter,
      pagination,
    );

    return this.responseService.createResponse(
      HttpStatus.OK,
      'Tasks fetched successfully',
      {
        items: tasks,
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
  ): Promise<ResponseI<Task>> {
    const userId = req.user.id;
    const task = await this.tasksService.findOne(id, userId);

    return this.responseService.createResponse(
      HttpStatus.OK,
      'Task fetched successfully',
      task,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestType,
  ): Promise<ResponseI<Task>> {
    const userId = req.user.id;
    const task = await this.tasksService.update(id, updateTaskDto, userId);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Task updated successfully',
      task,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Request() req: RequestType,
  ): Promise<void> {
    const userId = req.user.id;
    await this.tasksService.remove(id, userId);
  }
}
