import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAdminModule } from './routes/routes.admin.module';
import { RoutesPublicModule } from './routes/routes.public.module';
import { RoutesSystemModule } from './routes/routes.system.module';
import { RoutesSharedModule } from './routes/routes.shared.module';
import { RoutesUserModule } from './routes/routes.user.module';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [
    RoutesPublicModule,
    RoutesSystemModule,
    RoutesAdminModule,
    RoutesSharedModule,
    RoutesUserModule,
    NestJsRouterModule.register([
      {
        path: '/public',
        module: RoutesPublicModule,
      },
      {
        path: '/system',
        module: RoutesSystemModule,
      },
      {
        path: '/admin',
        module: RoutesAdminModule,
      },
      {
        path: '/shared',
        module: RoutesSharedModule,
      },
      {
        path: '/user',
        module: RoutesUserModule,
      },
    ]),
  ],
})
export class RouterModule {}
