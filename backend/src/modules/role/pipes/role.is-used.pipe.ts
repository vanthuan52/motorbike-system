import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '@/modules/user/services/user.service';

import { RoleDoc } from '../entities/role.entity';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../enums/role.status-code.enum';

@Injectable()
export class RoleIsUsedPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any): Promise<RoleDoc> {
    const exist = await this.userService.existByRole(value._id);
    if (exist) {
      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.USED,
        message: 'role.error.used',
      });
    }

    return value;
  }
}
