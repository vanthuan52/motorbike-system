import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './app/middleware/logger.middleware';
import { UsersModule } from './modules/user/user.module';
import appConfig from './config/app.config';
import databaseConfig from './common/database/config/database.config';
import { MongooseConfigService } from './common/database/mongoose-config.service';
import docConfig from './config/doc.config';
import { UserSeedModule } from './common/database/seeders/user/user-seed.module';

// <database-block>
const databaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});
// </database-block>

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, docConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'production'}`,
    }),
    databaseModule,
    UsersModule,
    UserSeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
