import { IsDateString, IsOptional } from 'class-validator';

export class TodayFilterDto {
  @IsOptional()
  @IsDateString()
  date: string;
}
