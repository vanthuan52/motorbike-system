import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { RoleCreateRequestDto } from '@/modules/role/dtos/request/role.create.request.dto';
import { RoleService } from '@/modules/role/services/role.service';
import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

@Injectable()
export class MigrationRoleSeed {
  constructor(private readonly roleService: RoleService) {}

  @Command({
    command: 'seed:role',
    describe: 'seed roles',
  })
  async seeds(): Promise<void> {
    const data: RoleCreateRequestDto[] = [
      {
        name: 'superadmin',
        type: EnumRoleType.superAdmin,
        abilities: [],
      },
      {
        name: 'admin',
        type: EnumRoleType.admin,
        abilities: Object.values(EnumPolicySubject)
          .filter((e) => e !== EnumPolicySubject.apiKey)
          .map((val) => ({
            subject: val,
            action: [EnumPolicyAction.manage],
          })),
      },
      {
        name: 'technician',
        type: EnumRoleType.technician,
        abilities: [],
      },
      {
        name: 'user',
        type: EnumRoleType.user,
        abilities: [],
      },
    ];

    try {
      await this.roleService.createMany(data);
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }

  @Command({
    command: 'remove:role',
    describe: 'remove roles',
  })
  async remove(): Promise<void> {
    try {
      await this.roleService.deleteMany();
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }
}
