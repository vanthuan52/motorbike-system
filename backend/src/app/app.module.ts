import { Module } from '@nestjs/common';
import { RouterModule } from '../router/router.module';
import { CommonModule } from '@/common/common.module';

@Module({
  controllers: [],
  providers: [],
  imports: [CommonModule, RouterModule],
})
export class AppModule {}
