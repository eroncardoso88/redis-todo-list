import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_CLIENT } from '../redis/redis.module';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private redisClient: Redis,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    
    const sessionId = uuidv4();
    
    const sessionData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date().toISOString(),
    };
    
    const expiresIn = parseInt(
      this.configService.get('jwt.expiresIn').replace('s', ''),
      10,
    );
    
    await this.redisClient.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      'EX',
      expiresIn,
    );
    
    return {
      access_token: accessToken,
      session_id: sessionId,
    };
  }

  async getSession(sessionId: string) {
    const sessionData = await this.redisClient.get(`session:${sessionId}`);
    if (!sessionData) {
      throw new UnauthorizedException('Invalid session');
    }
    return JSON.parse(sessionData);
  }

  async invalidateSession(sessionId: string) {
    await this.redisClient.del(`session:${sessionId}`);
    return { success: true };
  }
}