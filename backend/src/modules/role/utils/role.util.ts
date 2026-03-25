import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { RoleAbilitiesResponseDto } from '@/modules/role/dtos/response/role.abilities.response.dto';
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { IRole } from '../interfaces/role.interface';

@Injectable()
export class RoleUtil {
  mapList(roles: IRole[]): RoleListResponseDto[] {
    return plainToInstance(RoleListResponseDto, roles);
  }

  mapOne(role: IRole): RoleDto {
    return plainToInstance(RoleDto, role);
  }

  mapAbilities(role: IRole): RoleAbilitiesResponseDto {
    return plainToInstance(RoleAbilitiesResponseDto, {
      abilities: role.abilities,
    });
  }

  mapActivityLogMetadata(role: IRole): IActivityLogMetadata {
    return {
      roleId: role.id,
      roleName: role.name,
      roleType: role.type,
      timestamp: role.updatedAt ?? role.createdAt,
    };
  }
}
