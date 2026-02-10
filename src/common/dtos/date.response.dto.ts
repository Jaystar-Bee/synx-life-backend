import { ApiProperty } from '@nestjs/swagger';

export class DateResponseDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
