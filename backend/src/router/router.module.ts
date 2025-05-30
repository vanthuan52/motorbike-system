import { Module } from '@nestjs/common';
import { RoutesAmdinModule } from './routes/routes.admin.module';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [RoutesAmdinModule],
})
export class RouterModule {}
