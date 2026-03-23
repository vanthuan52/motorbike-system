import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/services/user.service';
import { AwsModule } from '@/common/aws/aws.module';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserUtil } from '@/modules/user/utils/user.util';

@Module({
  imports: [AwsModule],
  exports: [UserService, UserRepository, UserUtil],
  providers: [UserService, UserRepository, UserUtil],
  controllers: [],
})
export class UserModule {}
