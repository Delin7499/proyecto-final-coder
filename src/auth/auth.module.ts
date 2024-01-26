import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { RecoveryToken } from './schemas/recoveryToken.schema';
import { RecoveryTokenSchema } from './schemas/recoveryToken.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MailModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    }),
    MongooseModule.forFeature([
      { name: RecoveryToken.name, schema: RecoveryTokenSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy, GithubStrategy],
  exports: [AuthService, JwtStrategy, GithubStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
