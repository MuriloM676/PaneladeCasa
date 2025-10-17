import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.users.create(dto);
    return this.auth.login({ id: user.id, email: user.email, role: user.role });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.auth.validateUser(body.email, body.password);
    return this.auth.login(user);
  }
}
