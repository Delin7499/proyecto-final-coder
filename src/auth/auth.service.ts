import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/DTO/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (bcrypt.compareSync(password, user.password)) {
        const { password, ...result } = user;
        user.lastConnection = new Date();
        this.userService.updateByEmail(email, user);
        return result;
      } else {
        throw new UnauthorizedException("Passwords don't match");
      }
    } catch (err) {
      throw new UnauthorizedException("User doesn't exist");
    }
  }

  async login(user: any) {
    const payload = { user, sub: user.id };

    return { token: this.jwtService.sign(payload) };
  }

  async register(user: CreateUserDto) {
    return this.userService.create(user);
  }
}
