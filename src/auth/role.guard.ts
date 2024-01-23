import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Add the existing authentication check
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info, context) {
    // You can add custom authentication error handling here
    if (err || !user) {
      throw err || new ForbiddenException();
    }

    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (requiredRole && user.role !== requiredRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return user;
  }
}

import { SetMetadata } from '@nestjs/common';

export const Roles = (role: string) => SetMetadata('role', role);
