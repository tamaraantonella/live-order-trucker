import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserCredentials } from '../types';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUserCredentials(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokenResponse(user);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newUser = {
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
    } as User;

    const savedUser = await this.usersService.create(newUser);

    return this.generateTokenResponse({
      email: savedUser.email,
      id: savedUser.id,
      role: savedUser.role,
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    return this.validateUserCredentials(email, password);
  }

  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserCredentials | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );

    if (isPasswordValid) {
      return {
        email: user.email,
        id: user.id,
        role: user.role,
      };
    }

    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateTokenResponse(user: Pick<User, 'email' | 'id' | 'role'>): {
    access_token: string;
    user: Pick<User, 'id' | 'email' | 'role'>;
  } {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
