import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../enums/role.status-code.enum';
import { RoleService } from '../services/role.service';

@Injectable()
export class RoleParsePipe implements PipeTransform {
  constructor(private readonly roleService: RoleService) {}

  async transform(value: any) {
    const role = await this.roleService.findOneById(value);

    if (!role) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'role.error.notFound',
      });
    }

    return role;
  }
}
