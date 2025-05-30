import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepositoryModule } from './repository/user.repository.module';

@Module({
  imports: [UserRepositoryModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
