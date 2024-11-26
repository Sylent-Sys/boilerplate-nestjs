import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const token = await this.authService.login(body);
    return {
      data: { token },
    };
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Request() req: any) {
    return { data: req.user };
  }
}
