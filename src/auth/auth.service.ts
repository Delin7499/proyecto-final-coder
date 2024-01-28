import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/DTO/create-user.dto';
import { Model, Types } from 'mongoose';
import { RecoveryToken } from './schemas/recoveryToken.schema';
import { InjectModel } from '@nestjs/mongoose';
import { GitHubLoggInException } from './github-loggin.exception';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectModel(RecoveryToken.name)
    private recoveryTokenModel: Model<RecoveryToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (user.isGithub) {
        throw new GitHubLoggInException();
      }
      if (bcrypt.compareSync(password, user.password)) {
        const { password, ...result } = user;

        return result;
      } else {
        throw new UnauthorizedException('Invalid email or password');
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  async login(user: any) {
    const payload = { user, sub: user.id };
    if (user.email !== 'Admin') {
      const logUser = await this.userService.findByEmail(user.email);
      logUser.lastConnection = new Date();
      this.userService.updateByEmail(logUser.email, logUser);
    }

    return { token: this.jwtService.sign(payload) };
  }

  async register(user: CreateUserDto) {
    return this.userService.create(user);
  }

  async userExists(email: string) {
    if (await this.userService.findByEmail(email)) {
      return true;
    } else {
      return false;
    }
  }

  async createRecoveryToken(email: string, token: string) {
    return await this.recoveryTokenModel.create({
      email,
      token,
    });
  }

  async findRecoveryToken(email: string, token: string) {
    return await this.recoveryTokenModel.findOne({
      email,
      token,
    });
  }

  async deleteRecoveryToken(id: Types.ObjectId) {
    return await this.recoveryTokenModel.findByIdAndDelete(id);
  }
}
