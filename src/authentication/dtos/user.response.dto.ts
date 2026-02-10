import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsEmail, IsBoolean } from 'class-validator';
import { DateResponseDto } from 'src/common/dtos/date.response.dto';

export class UserResponseDto extends DateResponseDto {
  @IsUUID()
  @ApiProperty({ type: String, format: 'uuid' })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @IsBoolean()
  @ApiProperty({ type: Boolean, default: false })
  isVerified: boolean;
}
