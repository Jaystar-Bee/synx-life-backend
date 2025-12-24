import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  Max,
  IsOptional,
  Matches,
} from 'class-validator';
import { HabitFrequency } from '../habit.model';
import { Type } from 'class-transformer';

export class CreateHabitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(HabitFrequency)
  frequency: HabitFrequency;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @Min(0, { each: true }) // 0 = Sunday
  @Max(6, { each: true })
  customDays: number[];

  @IsOptional()
  @IsString()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message:
      'reminderTime must be in HH:mm format with leading zeros (e.g., 08:30)',
  })
  reminderTime: string;

  @IsNotEmpty()
  @IsUUID()
  userId?: string;
}
