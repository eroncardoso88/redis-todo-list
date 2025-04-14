import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(username: string, password: string): Promise<User> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = this.usersRepository.create({ username, password });
    return this.usersRepository.save(user);
  }
}