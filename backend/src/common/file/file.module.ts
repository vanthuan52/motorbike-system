import { AwsModule } from '@/modules/aws/aws.module';
import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({})
export class FileModule {
  static forRoot(): DynamicModule {
    return {
      module: FileModule,
      providers: [],
      exports: [],
      imports: [AwsModule],
      controllers: [],
    };
  }
}
