import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAdminModule } from './routes/routes.admin.module';
import { RoutesPublicModule } from './routes/routes.public.module';
import { RoutesSystemModule } from './routes/routes.system.module';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [
    RoutesAdminModule,
    RoutesSystemModule,
    NestJsRouterModule.register([
      {
        path: '/admin',
        module: RoutesAdminModule,
      },
      {
        path: '/public',
        module: RoutesPublicModule,
      },
      {
        path: '/system',
        module: RoutesSystemModule,
      },
    ]),
  ],
})
export class RouterModule {}
