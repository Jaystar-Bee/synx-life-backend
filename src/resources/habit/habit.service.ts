import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './../../authentication/user/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HabitFrequency } from './habit.model';
import { NotificationService } from './../../common/services/notification/notification.service';
import moment from 'moment';
import { NotificationType } from 'src/common/interface/enums';
import { FilterHabitDto } from './dto/filter.dto';
import { PaginationQuery } from 'src/common/dtos/pagination.query';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}
  async create(createHabitDto: CreateHabitDto): Promise<Habit> {
    // check is user exists
    await this.validateUser(createHabitDto.userId as string);

    // create habit;
    if (createHabitDto.frequency == HabitFrequency.DAILY) {
      createHabitDto.customDays = [0, 1, 2, 3, 4, 5, 6];
    } else if (
      createHabitDto.frequency == HabitFrequency.WEEKLY &&
      (!createHabitDto.customDays || createHabitDto.customDays.length === 0)
    ) {
      throw new BadRequestException(
        'customDays must be provided for weekly habits',
      );
    }
    const habit = this.habitRepository.create(createHabitDto);
    return this.habitRepository.save(habit);
  }

  async findAll(
    filter: FilterHabitDto,
    pagination: PaginationQuery,
    userId: string,
  ): Promise<[Habit[], number]> {
    await this.validateUser(userId);
    const query = this.habitRepository.createQueryBuilder('habit');
    query.where('habit.userId = :userId', { userId });

    if (filter.frequency) {
      query.andWhere('habit.frequency = :frequency', {
        frequency: filter.frequency,
      });
    }
    if (filter.search?.trim()) {
      query.andWhere('habit.name ILIKE :name', {
        name: `%${filter.search.trim()}%`,
      });
    }
    // date
    if (filter.date && filter.date?.length > 0) {
      query.andWhere('habit.customDays && :date', {
        date: filter.date,
      });
    }
    query.skip((pagination.pageNumber - 1) * pagination.perPage);
    query.take(pagination.perPage);

    const [habits, total] = await query.getManyAndCount();
    return [habits, total];
  }

  async findOne(id: string, userId: string): Promise<Habit> {
    await this.validateUser(userId);
    const habit = await this.habitRepository.findOne({
      where: { id, userId },
    });
    if (!habit) {
      throw new ForbiddenException('Habit does not exist');
    }
    return habit;
  }

  async update(
    id: string,
    updateHabitDto: UpdateHabitDto,
    userId: string,
  ): Promise<Habit> {
    await this.validateUser(userId);
    const habit = await this.validateHabit(id, userId);
    Object.assign(habit, updateHabitDto);
    return await this.habitRepository.save(habit);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.validateUser(userId);
    await this.validateHabit(id, userId);
    await this.habitRepository.delete(id);
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }
  }

  private async validateHabit(habitId: string, userId: string): Promise<Habit> {
    const habit = await this.habitRepository.findOneBy({ id: habitId, userId });
    if (!habit) {
      throw new ForbiddenException('Habit does not exist');
    }
    return habit;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = moment().format('HH:mm');

    const pendingHabits = await this.habitRepository
      .createQueryBuilder('habit')
      .leftJoinAndSelect('habit.user', 'user')
      .leftJoinAndSelect(
        'habit.completions',
        'completion',
        'completion.completedAt = :todayDate',
        { todayDate: moment().format('YYYY-MM-DD') },
      )
      .where('habit.reminderTime = :currentTime', { currentTime })
      .andWhere('habit.customDays LIKE :todayIndex', {
        todayIndex: `%${currentDay}%`,
      })
      .andWhere('completion.id IS NULL')
      .getMany();
    // Send notifications
    await Promise.all(
      pendingHabits.map(async (habit) => {
        if (!habit.user?.fcmToken) {
          return;
        }
        return await this.notificationService.sendPush(
          habit.user?.fcmToken,
          habit.name,
          `It's time to do ${habit.name}`,
          { habit, type: NotificationType.HABIT_REMINDER },
        );
      }),
    );
  }
}
