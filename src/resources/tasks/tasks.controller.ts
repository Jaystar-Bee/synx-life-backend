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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from './../../authentication/guards/auth.guard';
import type { RequestType } from './../../common/interface/request.type';
import { ResponseI } from './../../common/interface/response';
import { Task } from './entities/task.entity';
import { ResponseService } from './../../common/services/response.service';

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
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseI<Task>> {
    const task = await this.tasksService.findOne(id);

    return this.responseService.createResponse(
      HttpStatus.OK,
      'Task fetched successfully',
      task,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}
