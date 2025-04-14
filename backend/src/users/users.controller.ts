import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() createUserDto: { username: string; password: string },
  ) {
    const user = await this.usersService.create(
      createUserDto.username,
      createUserDto.password,
    );
    
    return {
      id: user.id,
      username: user.username,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
    };
  }
}