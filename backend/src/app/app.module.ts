import { Module } from '@nestjs/common';
import { RouterModule } from '../router/router.module';
import { CommonModule } from '@/common/common.module';
import { AppMiddlewareModule } from './app.middleware.module';

@Module({
  controllers: [],
  providers: [],
  imports: [CommonModule, AppMiddlewareModule, RouterModule],
})
export class AppModule {}
