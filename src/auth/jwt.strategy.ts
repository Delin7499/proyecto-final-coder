import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          if (!request || !request.cookies || !request.cookies['jwt']) {
            return null;
          }
          return request.cookies['jwt'].token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: '4b4c4d4e4f4g4h4i4j4k4l4m4n4o4p4q4r4s4t4u4v4w4x4y4z',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, user: payload.user };
  }
}
