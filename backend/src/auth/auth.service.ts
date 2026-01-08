import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

async signup(name: string, email: string, password: string) {
  const user = await this.usersService.create(name, email, password);
  return {
    user,
    token: this.jwtService.sign({ sub: user.id, email: user.email }),
  };
}



  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException();

    return {
      user,
      token: this.jwtService.sign({ sub: user.id }),
    };
  }
}
