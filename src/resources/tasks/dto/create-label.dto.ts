import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLabelDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
