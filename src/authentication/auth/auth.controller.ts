import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponse } from './../../common/interface/login.response';
import { User } from '../user/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import type { RequestType } from './../../common/interface/request.type';
import { UserService } from '../user/user.service';
import { ResponseService } from './../../common/services/response.service';
import { ResponseI } from './../../common/interface/response';
import { VerifyEmailDto } from '../dtos/verify-otp.dto';
import { SendOtpDto } from '../dtos/send-otp.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseI<User>> {
    const user = await this.authService.register(createUserDto);
    return this.responseService.createResponse(
      HttpStatus.CREATED,
      'User created',
      user,
    );
  }

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseI<LoginResponse<User>>> {
    const user = await this.authService.login(loginDto);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'User logged in',
      user,
    );
  }

  // verify email
  @Post('verify-email')
  public async verifyEmail(
    @Body() verifyOtpDto: VerifyEmailDto,
  ): Promise<ResponseI<User>> {
    const user = await this.authService.verifyOtp(verifyOtpDto);
    return this.responseService.createResponse(
      HttpStatus.ACCEPTED,
      'Your account is verified',
      user,
    );
  }

  // send otp
  @Post('send-otp')
  public async sendOtp(
    @Body() sendOtpDto: SendOtpDto,
    @Request() request: RequestType,
  ): Promise<ResponseI<void>> {
    if (request?.user?.name && !sendOtpDto?.name) {
      sendOtpDto.name = request.user.name;
    }
    await this.authService.sendOtp(sendOtpDto);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Otp sent to the provided email',
    );
  }

  // refresh token

  // forgot password
  @Get('profile')
  @UseGuards(AuthGuard)
  public async getProfile(
    @Request() request: RequestType,
  ): Promise<ResponseI<User>> {
    const id = request.user.id;
    const user = await this.userService.findOneById(id);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'User profile fetched',
      user,
    );
  }
}
