import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() createUserDto: { name: string; password: string, email: string },
  ) {
    const user = await this.usersService.create(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
  }
}