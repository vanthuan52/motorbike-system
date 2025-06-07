import { Module } from '@nestjs/common';
import { HelloPublicController } from '@/modules/hello/controllers/hello.public.controller';
@Module({
  controllers: [HelloPublicController],
  providers: [],
  exports: [],
  imports: [],
})
export class RoutesPublicModule {}
