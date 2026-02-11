import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateHabitDto } from 'src/resources/habit/dto/create-habit.dto';
import { UpdateHabitDto } from 'src/resources/habit/dto/update-habit.dto';
import { CreateTaskDto } from 'src/resources/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/resources/tasks/dto/update-task.dto';
import { ActionE, SyncTableE } from 'src/resources/tasks/interfaces/sync.enum';

export class SyncDto {
  @IsNotEmpty()
  @IsDateString()
  last_sync: Date;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SyncChangeDto)
  changes: SyncChangeDto[];
}

export class SyncChangeDto {
  @IsEnum(SyncTableE)
  table: SyncTableE;

  @IsEnum(ActionE)
  @IsNotEmpty()
  action: ActionE;

  @IsNotEmpty()
  @Type((opts) => {
    const type = opts?.object.table;
    if (type === SyncTableE.HABIT) return UpdateHabitDto || CreateHabitDto;
    if (type === SyncTableE.TASK) return UpdateTaskDto || CreateTaskDto;
    return Object; // Fallback
  })
  @ValidateNested()
  data: UpdateHabitDto | UpdateTaskDto | CreateHabitDto | CreateTaskDto;
}
