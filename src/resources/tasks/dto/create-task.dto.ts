import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CategoryE } from '../interfaces/category.enum';
import { PriorityE } from '../interfaces/priority.enum';
import { Type } from 'class-transformer';
import { CreateLabelDto } from './create-label.dto';
import { CreateSubTaskDto } from './create-sub-task.dto';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsNotEmpty()
  @IsEnum(CategoryE)
  category: CategoryE;

  @IsNotEmpty()
  @IsEnum(PriorityE)
  priority: PriorityE;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLabelDto)
  labels?: CreateLabelDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubTaskDto)
  subTasks?: CreateSubTaskDto[];
}
