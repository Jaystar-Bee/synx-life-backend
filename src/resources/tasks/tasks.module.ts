import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Label } from './entities/label.entity';
import { SubTask } from './entities/sub-task.entity';
import { UserService } from './../../authentication/user/user.service';
import { User } from './../../authentication/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Label, SubTask, User])],
  controllers: [TasksController],
  providers: [TasksService, UserService],
})
export class TasksModule {}
