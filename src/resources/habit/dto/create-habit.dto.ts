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
  IsDateString,
} from 'class-validator';
import { HabitFrequency } from '../habit.model';
import { Type } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateHabitDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsEnum(HabitFrequency)
  frequency: HabitFrequency;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @Min(0, { each: true }) // 0 = Sunday
  @Max(6, { each: true })
  @ApiProperty()
  customDays: number[];

  @IsOptional()
  @IsString()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message:
      'reminderTime must be in HH:mm format with leading zeros (e.g., 08:30)',
  })
  @ApiProperty()
  reminderTime: string;

  @IsOptional()
  @IsUUID()
  @ApiHideProperty()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsOptional()
  @ApiProperty()
  @IsDateString()
  updatedAt?: Date;
}
