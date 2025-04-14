// src/auth/auth.controller.ts
import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('session/:id')
  async getSession(@Param('id') sessionId: string) {
    return this.authService.getSession(sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout/:id')
  async logout(@Param('id') sessionId: string) {
    return this.authService.invalidateSession(sessionId);
  }
}