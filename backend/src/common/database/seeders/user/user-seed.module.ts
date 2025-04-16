import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSeedService } from './user-seed.service';
import { UserEntity, UserSchema } from '@/modules/user/entities/user.entity';
import {
  EmployeeEntity,
  EmployeeSchema,
} from '@/modules/employee/entities/employee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: EmployeeEntity.name,
        schema: EmployeeSchema,
      },
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
