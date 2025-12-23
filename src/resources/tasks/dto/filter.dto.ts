import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryE } from '../interfaces/category.enum';

export class FilterTaskDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsEnum(CategoryE)
  category?: CategoryE;

  @IsOptional()
  @IsString()
  label?: string;
}
