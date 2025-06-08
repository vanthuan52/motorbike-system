import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../services/user.service';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { IUserDoc } from '../interfaces/user.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';
import { ENUM_USER_STATUS } from '../enums/user.enum';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '@/modules/role/enums/role.status-code.enum';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const emailVerified =
    //   this.reflector.get<boolean[]>(
    //     USER_GUARD_EMAIL_VERIFIED_META_KEY,
    //     context.getHandler(),
    //   ) || [];

    const request = context.switchToHttp().getRequest<IRequestApp>();

    // Using Optional Chaining to fix error on
    // Property 'user' does not exist on type 'IAuthJwtAccessTokenPayload | undefined'
    // const { user } = request.user;
    const user = request.user?.user ?? 'user-id-not-found';

    const userWithRole: IUserDoc | null =
      await this.userService.findOneWithRoleById(user);

    if (!userWithRole) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    } else if (userWithRole.status !== ENUM_USER_STATUS.ACTIVE) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'user.error.inactive',
      });
    } else if (!userWithRole.role.isActive) {
      throw new ForbiddenException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
        message: 'role.error.inactive',
      });
    }

    // const checkPasswordExpired: boolean =
    //       this.authService.checkPasswordExpired(userWithRole.passwordExpired);
    //   if (checkPasswordExpired) {
    //       throw new ForbiddenException({
    //           statusCode: ENUM_USER_STATUS_CODE_ERROR.PASSWORD_EXPIRED,
    //           message: 'auth.error.passwordExpired',
    //       });
    //   } else if (
    //       emailVerified.includes(true) &&
    //       userWithRole.verification.email !== true
    //   ) {
    //       throw new ForbiddenException({
    //           statusCode: ENUM_USER_STATUS_CODE_ERROR.EMAIL_NOT_VERIFIED,
    //           message: 'user.error.emailNotVerified',
    //       });
    //   }

    request.__user = userWithRole;

    return true;
  }
}
