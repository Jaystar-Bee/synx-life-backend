import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { HabitService } from '../habit/habit.service';
import { SyncDto, SyncChangeDto } from './dto/sync.dto';
import { ActionE, SyncTableE } from '../tasks/interfaces/sync.enum';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { CreateHabitDto } from '../habit/dto/create-habit.dto';
import { UpdateHabitDto } from '../habit/dto/update-habit.dto';

@Injectable()
export class SyncService {
  constructor(
    private readonly taskService: TasksService,
    private readonly habitService: HabitService,
  ) {}

  public async sync(userId: string, syncDto: SyncDto) {
    const tasks = syncDto.changes.filter(
      (change) => change.table == SyncTableE.TASK,
    );

    const habits = syncDto.changes.filter(
      (change) => change.table == SyncTableE.HABIT,
    );

    const failledRequest: SyncChangeDto[] = [];

    if (tasks.length > 0) {
      for (const task of tasks) {
        if (task?.action == ActionE.CREATE) {
          const res = await this.sendRequest(
            this.taskService.create(task.data as CreateTaskDto),
            task,
          );
          if (res) {
            failledRequest.push(res);
          }
        } else if (task?.action == ActionE.UPDATE) {
          const res = await this.sendRequest(
            this.taskService.update(
              task.data.id as string,
              task.data as UpdateTaskDto,
              userId,
            ),
            task,
          );
          if (res) {
            failledRequest.push(res);
          }
        } else if (task?.action == ActionE.DELETE) {
          const res = await this.sendRequest(
            this.taskService.remove(task.data.id as string, userId),
            task,
          );
          if (res) {
            failledRequest.push(res);
          }
        }
      }
    }
    if (habits.length > 0) {
      for (const habit of habits) {
        if (habit?.action == ActionE.CREATE) {
          const res = await this.sendRequest(
            this.habitService.create(habit.data as CreateHabitDto),
            habit,
          );
          if (res) {
            failledRequest.push(res);
          }
        } else if (habit?.action == ActionE.UPDATE) {
          const res = await this.sendRequest(
            this.habitService.update(
              habit.data.id as string,
              habit.data as UpdateHabitDto,
              userId,
            ),
            habit,
          );
          if (res) {
            failledRequest.push(res);
          }
        } else if (habit?.action == ActionE.DELETE) {
          const res = await this.sendRequest(
            this.habitService.remove(habit.data.id as string, userId),
            habit,
          );
          if (res) {
            failledRequest.push(res);
          }
        }
      }
    }

    return failledRequest;
  }

  private async sendRequest(request, data): Promise<SyncChangeDto | null> {
    try {
      await request;
      return null;
    } catch (_) {
      return data;
    }
  }
}
