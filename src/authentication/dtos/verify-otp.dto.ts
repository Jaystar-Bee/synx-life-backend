import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4)
  otp: string;
}
