import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { FilterTaskDto } from './dto/filter.dto';
import { PaginationQuery } from './../../common/dtos/pagination.query';
import moment from 'moment';
import { UserService } from './../../authentication/user/user.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}
  public async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await this.validateUser(createTaskDto['userId'] as string);
    const newDate = createTaskDto['date'] || new Date();
    createTaskDto['date'] = newDate;
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  public async findAll(
    userId: string,
    filter: FilterTaskDto,
    pagination: PaginationQuery,
  ): Promise<[Task[], number]> {
    await this.validateUser(userId);
    const query = this.taskRepository.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId });

    if (filter.isCompleted !== undefined) {
      query.andWhere('task.isCompleted = :isCompleted', {
        isCompleted: filter.isCompleted,
      });
    }

    if (filter.category?.trim()) {
      query.andWhere('task.category = :category', {
        category: filter?.category?.trim(),
      });
    }

    if (filter.label?.trim()) {
      query.andWhere('task.label = :label', { label: filter?.label?.trim() });
    }

    if (filter.date) {
      query.andWhere('DATE(task.date) = :date', {
        date: moment(filter.date).format('YYYY-MM-DD'),
      });
    }

    if (filter.search?.trim()) {
      query
        .leftJoin('task.labels', 'label')
        .andWhere(
          'task.title ILIKE :search OR task.description ILIKE :search OR label.name ILIKE :search',
          {
            search: `%${filter.search?.trim()}%`,
          },
        );
    }
    query.leftJoinAndSelect('task.labels', 'labels');
    query.leftJoinAndSelect('task.subTasks', 'subTasks');

    query.skip((pagination.pageNumber - 1) * pagination.perPage);
    query.take(pagination.perPage);

    query.orderBy('task.createdAt', 'DESC');

    const [tasks, total] = await query.getManyAndCount();
    return [tasks, total];
  }

  public async findOne(id: string, userId: string) {
    await this.validateUser(userId);
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['labels', 'subTasks'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task && task?.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return task;
  }

  public async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    await this.validateUser(userId);
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task && task?.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  public async remove(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task && task?.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    await this.taskRepository.delete({ id });
  }

  private async validateUser(userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
