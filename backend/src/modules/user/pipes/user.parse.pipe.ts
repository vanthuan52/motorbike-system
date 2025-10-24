import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDoc } from '../entities/user.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from '../enums/user.status-code.enum';

@Injectable()
export class UserParsePipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any) {
    const user: UserDoc | null = await this.userService.findOneById(value);

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }
}

@Injectable()
export class UserActiveParsePipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any) {
    const user = await this.userService.findOneWithRoleById(value);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }
}

@Injectable()
export class UserPhoneNumberParsePipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any) {
    const user: UserDoc | null = await this.userService.findOneByPhone(value);

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }
}
