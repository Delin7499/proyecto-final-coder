import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID, // Your GitHub client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Your GitHub client secret
      callbackURL:
        'https://proyecto-final-coder-production-4c15.up.railway.app/auth/github/callback', // Your callback URL
      scope: ['user:email'], // GitHub scopes
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const email = profile.emails[0].value;
    const user = {
      first_name: profile._json.login,
      last_name: '',
      email,
      isGithub: true,
    };

    return { userId: email, user };
  }
}
