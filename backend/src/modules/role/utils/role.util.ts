import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { RoleDoc, RoleEntity } from '../entities/role.entity';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleDto } from '../dtos/role.dto';
import { RoleAbilitiesResponseDto } from '../dtos/response/role.abilities.response.dto';

@Injectable()
export class RoleUtil {
  mapList(roles: RoleDoc[] | RoleEntity[]): RoleListResponseDto[] {
    return plainToInstance(
      RoleListResponseDto,
      roles.map((e: RoleDoc | RoleEntity) =>
        e instanceof Document ? e.toObject() : e,
      ),
    );
  }

  mapOne(role: RoleDoc | RoleEntity): RoleDto {
    return plainToInstance(
      RoleDto,
      role instanceof Document ? role.toObject() : role,
    );
  }

  mapAbilities(role: RoleDoc | RoleEntity): RoleAbilitiesResponseDto {
    return plainToInstance(RoleAbilitiesResponseDto, {
      abilities: role.abilities,
    });
  }

  mapActivityLogMetadata(role: RoleDoc | RoleEntity): any {
    return {
      roleId: role._id.toString(),
      roleName: role.name,
      roleType: role.type,
      timestamp: role.updatedAt ?? role.createdAt,
    };
  }
}
