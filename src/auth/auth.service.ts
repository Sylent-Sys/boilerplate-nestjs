import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(key: string) {
    const user = await this.usersService.findOne(key);
    if (user) {
      return {
        ...user,
        password: undefined,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findOne(data.key);
    if (user && verify(user.password, data.password)) {
      return this.jwtService.sign(
        {
          sub: user.id,
          key: user.email,
        },
        {
          expiresIn: data.rememberMe ? '7d' : '1d',
          secret: this.configService.get('JWT_SECRET'),
        },
      );
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
