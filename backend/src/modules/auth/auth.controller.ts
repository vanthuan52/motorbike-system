import { DatabaseService } from '@/common/database/services/database.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: '/users',
})
export class UserAdminController {}
