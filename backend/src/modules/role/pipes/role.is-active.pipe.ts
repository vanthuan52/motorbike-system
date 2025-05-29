import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../enums/role.status-code.enum';

@Injectable()
export class RoleIsActivePipe implements PipeTransform {
  private readonly isActive: boolean[];

  constructor(isActive: boolean[]) {
    this.isActive = isActive;
  }

  async transform(value: any) {
    if (!this.isActive.includes(value.isActive)) {
      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR,
        message: 'role.error.isActiveInvalid',
      });
    }

    return value;
  }
}
