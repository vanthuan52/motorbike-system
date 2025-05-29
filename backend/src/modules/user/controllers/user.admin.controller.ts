import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { MessageService } from '@/common/message/services/message.service';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { RoleService } from '@/modules/role/services/role.service';
@ApiTags('modules.admin.user')
@Controller({
  version: '1',
  path: '/users',
})
export class UserAdminController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}
}
