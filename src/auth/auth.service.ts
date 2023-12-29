import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && (await bcrypt.compare(pass, user.password))) {

      const payload = { username: user.email  };
      return {
        ...result,
        accessToken: this.jwtService.sign(payload),
      };
    }
    return null;
  }
}
