import { ConflictException, Injectable } from '@nestjs/common';
import { HashService } from '../hash/hash.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './../../common/interface/login.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(createuserDto: CreateUserDto): Promise<User> {
    const emailIsRegistered = await this.userService.findOneByEmail(
      createuserDto.email,
    );
    if (emailIsRegistered) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await this.hashService.hashText(
      createuserDto.password,
    );
    return this.userService.create({
      ...createuserDto,
      password: hashedPassword,
    });
  }

  public async login(loginDto: LoginDto): Promise<LoginResponse<User>> {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new ConflictException('Email or password is incorrect');
    }
    const isPasswordValid = await this.hashService.confirmHash(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ConflictException('Email or password is incorrect');
    }
    const token = await this.generateToken(user);
    return {
      user,
      token,
    };
  }

  private async generateToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }
}
