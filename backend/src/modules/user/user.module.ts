import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepositoryModule } from './repository/user.repository.module';
import { MediaModule } from '@/modules/media/media.module';
import { RoleModule } from '../role/role.module';
import { SessionModule } from '../session/session.module';
import { UserUtil } from './utils/user.util';

@Module({
  imports: [UserRepositoryModule, RoleModule, SessionModule, MediaModule],
  exports: [UserService, UserUtil],
  providers: [UserService, UserUtil],
  controllers: [],
})
export class UserModule {}
