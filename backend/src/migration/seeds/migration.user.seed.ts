import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { MessageService } from '@/common/message/services/message.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { RoleDoc } from '@/modules/role/entities/role.entity';
import { RoleService } from '@/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from '@/modules/user/enums/user.enum';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class MigrationUserSeed {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly messageService: MessageService,
  ) {}

  @Command({
    command: 'seed:user',
    describe: 'seed users',
  })
  async seeds(): Promise<void> {
    const password = 'aaAA@123';
    const passwordHash = this.authService.createPassword(password);
    const superAdminRole: RoleDoc | null =
      await this.roleService.findOneByName('superadmin');

    const adminRole: RoleDoc | null =
      await this.roleService.findOneByName('admin');

    const technicianRole: RoleDoc | null =
      await this.roleService.findOneByName('technician');

    const userRole: RoleDoc | null =
      await this.roleService.findOneByName('user');

    if (!superAdminRole || !adminRole || !technicianRole || !userRole) {
      throw new Error('Role not exists');
    }
    try {
      const users = await Promise.all([
        this.userService.create(
          {
            role: superAdminRole._id,
            name: 'superadmin',
            email: 'superadmin@mail.com',
          },
          passwordHash,
          ENUM_USER_SIGN_UP_FROM.SEED,
        ),
        this.userService.create(
          {
            role: adminRole._id,
            name: 'admin',
            email: 'admin@mail.com',
          },
          passwordHash,
          ENUM_USER_SIGN_UP_FROM.SEED,
        ),
        this.userService.create(
          {
            role: technicianRole._id,
            name: 'technician',
            email: 'technician@mail.com',
          },
          passwordHash,
          ENUM_USER_SIGN_UP_FROM.SEED,
        ),
        this.userService.create(
          {
            role: userRole._id,
            name: 'user',
            email: 'user@mail.com',
          },
          passwordHash,
          ENUM_USER_SIGN_UP_FROM.SEED,
        ),
      ]);
    } catch (err: any) {
      throw new Error(err);
    }
    return;
  }

  @Command({
    command: 'remove:user',
    describe: 'remove users',
  })
  async remove(): Promise<void> {
    try {
      await this.userService.deleteMany();
    } catch (err: any) {
      throw new Error(err);
    }

    return;
  }
}
