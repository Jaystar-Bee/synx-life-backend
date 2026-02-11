import { Module } from '@nestjs/common';
import { HabitService } from '../habit/habit.service';
import { TasksService } from '../tasks/tasks.service';
import { SyncService } from './sync.service';

@Module({
  providers: [SyncService],
})
export class SyncModule {
  providers: [HabitService, TasksService];
}
