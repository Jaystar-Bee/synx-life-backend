import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.register(createUserDto);
  }

  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse<User>> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  public async getProfile(
    @Request() request: RequestType,
  ): Promise<User | null> {
    const id = request.user.id;
    return await this.userService.findOneById(id);
  }
}
