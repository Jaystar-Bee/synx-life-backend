import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsNumberString,
  Length,
  Matches,
} from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4)
  otp: string;
}
