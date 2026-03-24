import { Global, Module } from '@nestjs/common';
import { PermissionService } from '@/modules/permission/services/permission.service';
import { PermissionUtil } from '@/modules/permission/utils/permission.util';
import { PermissionRepository } from '@/modules/permission/repositories/permission.repository';

@Global()
@Module({
  providers: [PermissionService, PermissionRepository, PermissionUtil],
  exports: [PermissionService, PermissionRepository, PermissionUtil],
  imports: [],
})
export class PermissionModule {}
