import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '../hash/hash.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './../../common/interface/login.response';
import ms, { StringValue } from 'ms';
import { MailService } from './../../mail/services/mail.service';
import { generateRandomNumbers } from 'src/utils/helpers';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './../../config/config.type';
import moment from 'moment';
import { VerifyEmailDto } from '../dtos/verify-otp.dto';
import { SendOtpDto } from '../dtos/send-otp.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const res = await this.sendOtp(
      { email: createUserDto.email, name: createUserDto.name },
      createUserDto,
      true,
    );

    return res as User;
  }

  public async login(loginDto: LoginDto): Promise<LoginResponse<User>> {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new ConflictException('Email or password is incorrect');
    }
    const isPasswordValid = await this.hashService.confirmHash(
      loginDto.password,
      user?.password as string,
    );
    if (!isPasswordValid) {
      throw new ConflictException('Email or password is incorrect');
    }
    if (!user.isVerified) {
      throw new ForbiddenException('Your account is not verified');
    }
    const token = await this.generateToken(user);
    const refreshToken = await this.generateToken(user, '30d');
    await this.userService.update({
      ...user,
      refreshToken: await this.hashService.hashText(refreshToken),
    });
    return {
      user,
      tokens: {
        accessToken: token,
        refreshToken: refreshToken,
      },
    };
  }

  public async verifyOtp(verifyOtpDto: VerifyEmailDto): Promise<User> {
    const user = await this.userService.findOneByEmail(verifyOtpDto.email);

    if (!user) {
      throw new ConflictException('User does not exist');
    }
    if (user.isVerified) {
      return user;
    }
    if (moment(user?.otpExpireTime).isBefore(moment())) {
      throw new ConflictException('The OTP has expired, please try again');
    }

    if (user.otp === verifyOtpDto.otp) {
      const res = await this.userService.update({ ...user, isVerified: true });
      if (res?.password) {
        delete res['password'];
      }
      if (res?.otp) {
        delete res['otp'];
      }
      delete res.otpExpireTime;
      return res;
    } else {
      throw new ForbiddenException('Invalid OTP');
    }
  }

  public async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse<User>> {
    // check if refresh token is expired
    let userId: string;
    try {
      const { id } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
      );
      userId = id;
    } catch (_) {
      throw new ConflictException('Token has expired, please login again');
    }
    //fetch user by id or email from refreshTokenDto
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if user is verified
    if (!user.isVerified) {
      throw new ForbiddenException('Your account is not verified');
    }

    // check if resfreshToken exists
    if (!user.refreshToken) {
      throw new ConflictException('Invalid token, please login again');
    }

    // check if refresh token matches
    const isRefreshTokenValid = await this.hashService.confirmHash(
      refreshTokenDto.refreshToken,
      user?.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new ConflictException('Invalid token, please login again');
    }

    // generate new access token
    const token = await this.generateToken(user);
    const refreshToken = await this.generateToken(user, '30d');

    // save new refresh token to user
    await this.userService.update({
      ...user,
      refreshToken: await this.hashService.hashText(refreshToken),
    });

    // return user with new access token
    return {
      user,
      tokens: {
        accessToken: token,
        refreshToken: refreshToken,
      },
    };
  }

  public async sendOtp(
    sendOtpDto: SendOtpDto,
    data?: User | CreateUserDto,
    isRegister?: boolean,
  ): Promise<User | void> {
    const emailIsRegistered = await this.userService.findOneByEmail(
      sendOtpDto?.email,
    );
    if (emailIsRegistered && isRegister) {
      throw new ConflictException('Email is already registered');
    }
    const otp = generateRandomNumbers(4);
    const otpExpireTime = moment
      .utc()
      .add(
        ms(this.configService.get('app').otpValidityTime as StringValue),
        'milliseconds',
      )
      .toDate();
    let res: User | undefined;
    if (isRegister && data) {
      const hashedPassword = await this.hashService.hashText(
        data?.password as string,
      );

      res = await this.userService.create({
        ...data,
        password: hashedPassword,
        otp,
        otpExpireTime,
      });
    } else if (emailIsRegistered) {
      await this.userService.update({
        ...emailIsRegistered,
        otp,
        otpExpireTime,
      });
    } else {
      throw new NotFoundException('You are not registered');
    }

    if (isRegister || emailIsRegistered) {
      await this.mailService.sendOtpEmail(
        sendOtpDto.email,
        sendOtpDto?.name || '',
        otp,
        new Date().getFullYear().toString(),
        this.configService.get('app').appName as string,
      );
    }

    if (res) {
      return res;
    }
  }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    // check if user exists
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // verify otp
    if (moment(user?.otpExpireTime).isBefore(moment())) {
      throw new ConflictException('The OTP has expired, please try again');
    }
    if (user.otp == forgotPasswordDto.otp) {
      const hashedPassword = await this.hashService.hashText(
        forgotPasswordDto.newPassword,
      );
      await this.userService.update({
        ...user,
        password: hashedPassword,
      });
    } else {
      throw new ForbiddenException('Invalid OTP');
    }
  }

  public async logout(userId: string): Promise<void> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userService.update({ ...user, refreshToken: null });
  }

  private async generateToken(user: User, time?: StringValue): Promise<string> {
    const payload = { id: user.id, email: user.email, name: user?.name };
    if (time) {
      return this.jwtService.signAsync(payload, { expiresIn: time });
    }
    return this.jwtService.signAsync(payload);
  }
}
