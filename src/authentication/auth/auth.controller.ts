import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
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
import { ResponseService } from './../../common/services/response.service';
import { ResponseI } from './../../common/interface/response';
import { VerifyEmailDto } from '../dtos/verify-otp.dto';
import { SendOtpDto } from '../dtos/send-otp.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user.response.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiExtraModels(UserResponseDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOkResponse({
    schema: {
      description: 'User created',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 201,
        },
        message: {
          type: 'string',
          example: 'User created',
        },
        data: {
          $ref: getSchemaPath(UserResponseDto),
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Register user',
    description: 'Simple Onboarding',
  })
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseI<UserResponseDto>> {
    const user = await this.authService.register(createUserDto);
    return this.responseService.createResponse(
      HttpStatus.CREATED,
      'User created',
      user,
    );
  }

  @ApiOperation({
    summary: 'Login user',
  })
  @ApiOkResponse({
    schema: {
      description: 'User logged in',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'User logged in',
        },
        data: {
          type: 'object',
          properties: {
            user: {
              $ref: getSchemaPath(UserResponseDto),
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
                refreshToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Verify email',
  })
  @ApiOkResponse({
    schema: {
      description: 'Your account is verified',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 202,
        },
        message: {
          type: 'string',
          example: 'Your account is verified',
        },
        data: {
          $ref: getSchemaPath(UserResponseDto),
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Send otp',
  })
  @ApiOkResponse({
    schema: {
      description: 'Otp sent to the provided email',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Otp sent to the provided email',
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Refresh token',
  })
  @ApiOkResponse({
    schema: {
      description: 'Token refreshed successfully',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Token refreshed successfully',
        },
        data: {
          type: 'object',
          properties: {
            user: {
              $ref: getSchemaPath(UserResponseDto),
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
                refreshToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  @Post('refresh-token')
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ResponseI<LoginResponse<User>>> {
    const userWithTokens = await this.authService.refreshToken(refreshTokenDto);
    return this.responseService.createResponse(
      HttpStatus.OK,
      'Token refreshed successfully',
      userWithTokens,
    );
  }

  // forgot password
  @ApiOperation({
    summary: 'Forgot password',
  })
  @ApiResponse({
    schema: {
      description: 'Password reset successfully',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 204,
        },
        message: {
          type: 'string',
          example: 'Password reset successfully',
        },
      },
    },
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResponseI<void>> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return this.responseService.createResponse(
      HttpStatus.NO_CONTENT,
      'Password reset successfully',
    );
  }

  // logout
  @ApiOperation({
    summary: 'Logout',
  })
  @ApiResponse({
    schema: {
      description: 'User logged out',
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 204,
        },
        message: {
          type: 'string',
          example: 'User logged out',
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(
    @Request() request: RequestType,
  ): Promise<ResponseI<void>> {
    const id = request.user.id;
    await this.authService.logout(id);
    return this.responseService.createResponse(
      HttpStatus.NO_CONTENT,
      'User logged out',
    );
  }
}
