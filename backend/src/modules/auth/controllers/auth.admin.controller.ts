import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from '@/common/database/services/database.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '@/modules/user/services/user.service';

@ApiTags('modules.admin.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthAdminController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
}
