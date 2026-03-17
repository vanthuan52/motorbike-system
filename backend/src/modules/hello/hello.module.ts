import { Module } from '@nestjs/common';
import { HelloService } from '@/modules/hello/services/hello.service';

@Module({
  controllers: [],
  providers: [HelloService],
  exports: [HelloService],
  imports: [],
})
export class HelloModule {}
