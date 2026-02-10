import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { TasksService } from '../tasks/tasks.service';
import { HabitService } from '../habit/habit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';
import { Habit } from '../habit/entities/habit.entity';
import { HabitCompletion } from '../habit/entities/habit-completion.entity';
import { HashService } from 'src/authentication/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Habit, HabitCompletion])],
  controllers: [MeController],
  providers: [MeService, TasksService, HabitService, HashService],
})
export class MeModule {}
