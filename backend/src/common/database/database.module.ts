import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseOptionService } from './services/database.options.service';
import { DatabaseService } from './services/database.service';
import { DatabaseUtil } from './utils/database.util';

@Module({
  providers: [DatabaseOptionService],
  exports: [DatabaseOptionService],
  imports: [],
  controllers: [],
})
export class DatabaseOptionModule {}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [DatabaseService, DatabaseUtil],
      exports: [DatabaseService, DatabaseUtil],
      imports: [],
      controllers: [],
    };
  }
}
