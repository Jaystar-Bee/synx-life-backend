import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
