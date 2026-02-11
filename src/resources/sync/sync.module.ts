import { Module } from '@nestjs/common';
import { HabitService } from '../habit/habit.service';
import { TasksService } from '../tasks/tasks.service';
import { SyncService } from './sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from '../habit/entities/habit.entity';
import { HabitCompletion } from '../habit/entities/habit-completion.entity';
import { Task } from '../tasks/entities/task.entity';
import { SyncController } from './sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitCompletion, Task])],
  controllers: [SyncController],
  providers: [SyncService, HabitService, TasksService],
})
export class SyncModule {}
