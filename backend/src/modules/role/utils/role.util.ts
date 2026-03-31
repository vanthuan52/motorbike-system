import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { RoleModel } from '../models/role.model';

@Injectable()
export class RoleUtil {
  mapList(roles: RoleModel[]): RoleListResponseDto[] {
    return plainToInstance(RoleListResponseDto, roles);
  }

  mapOne(role: RoleModel): RoleDto {
    return plainToInstance(RoleDto, role);
  }

  mapActivityLogMetadata(role: RoleModel): IActivityLogMetadata {
    return {
      roleId: role.id,
      roleName: role.name,
      roleType: role.type,
      timestamp: role.updatedAt ?? role.createdAt,
    };
  }
}
