import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { Permission } from '@/generated/prisma-client';

@Injectable()
export class PermissionUtil {
  mapList(Permissions: Permission[]): PermissionListResponseDto[] {
    return plainToInstance(PermissionListResponseDto, Permissions);
  }

  mapOne(Permission: Permission): PermissionDto {
    return plainToInstance(PermissionDto, Permission);
  }

  mapActivityLogMetadata(Permission: Permission): IActivityLogMetadata {
    return {
      PermissionId: Permission.id,
      PermissionName: Permission.name,
      PermissionType: Permission.type,
      timestamp: Permission.updatedAt ?? Permission.createdAt,
    };
  }
}
