import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const saltRounds =
      Number(this.configService.get('BCRYPT_SALT_ROUNDS')) || 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
