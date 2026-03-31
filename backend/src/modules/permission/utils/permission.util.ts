import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { PermissionModel } from '@/modules/permission/models/permission.model';

@Injectable()
export class PermissionUtil {
  mapList(permissions: PermissionModel[]): PermissionListResponseDto[] {
    return plainToInstance(PermissionListResponseDto, permissions);
  }

  mapOne(permission: PermissionModel): PermissionDto {
    return plainToInstance(PermissionDto, permission);
  }

  mapActivityLogMetadata(permission: PermissionModel): IActivityLogMetadata {
    return {
      permissionId: permission.id,
      permissionName: permission.name,
      permissionCode: permission.code,
      timestamp: permission.updatedAt ?? permission.createdAt,
    };
  }
}
