import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAdminModule } from './routes/routes.admin.module';
import { RoutesPublicModule } from './routes/routes.public.module';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [
    RoutesAdminModule,
    NestJsRouterModule.register([
      {
        path: '/admin',
        module: RoutesAdminModule,
      },
      {
        path: 'public',
        module: RoutesPublicModule,
      },
    ]),
  ],
})
export class RouterModule {}
