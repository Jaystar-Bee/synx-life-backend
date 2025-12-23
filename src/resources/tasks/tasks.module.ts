import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Label } from './entities/label.entity';
import { SubTask } from './entities/sub-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Label, SubTask])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
