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

  async findOne(name: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { name } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.findOne(name);
    if (existingUser) {
      throw new ConflictException('Name already exists');
    }

    const user = this.usersRepository.create({ name, email, password });
    return this.usersRepository.save(user);
  }
}