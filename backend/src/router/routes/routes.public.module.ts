import { Module } from '@nestjs/common';
import { HelloPublicController } from '@/modules/hello/controllers/hello.public.controller';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  controllers: [HelloPublicController],
  providers: [],
  exports: [],
  imports: [RoleModule],
})
export class RoutesPublicModule {}
