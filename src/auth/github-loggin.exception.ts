import { HttpException, HttpStatus } from '@nestjs/common';

export class GitHubLoggInException extends HttpException {
  constructor() {
    super('GitHub users cannot perform this action', HttpStatus.FORBIDDEN);
  }
}
