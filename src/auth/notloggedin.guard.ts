import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
