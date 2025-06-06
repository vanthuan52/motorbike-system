import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAdminModule } from './routes/routes.admin.module';
import { RoutesPublicModule } from './routes/routes.public.module';
import { RoutesSystemModule } from './routes/routes.system.module';
import { RoutesSharedModule } from './routes/routes.shared.module';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [
    RoutesAdminModule,
    RoutesSystemModule,
    RoutesSharedModule,
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
      {
        path: '/shared',
        module: RoutesSharedModule,
      },
    ]),
  ],
})
export class RouterModule {}
