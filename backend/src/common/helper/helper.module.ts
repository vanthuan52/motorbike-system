import { DynamicModule, Global, Module } from '@nestjs/common';
import { HelperArrayService } from './services/helper.array.service';
import { HelperStringService } from './services/helper.string.service';
import { HelperDateService } from './services/helper.date.service';
import { HelperEncryptionService } from './services/helper.encryption.service';
import { HelperHashService } from './services/helper.hash.service';
import { HelperNumberService } from './services/helper.number.service';

@Global()
@Module({})
export class HelperModule {
  static forRoot(): DynamicModule {
    return {
      module: HelperModule,
      providers: [
        HelperArrayService,
        HelperStringService,
        HelperDateService,
        HelperEncryptionService,
        HelperHashService,
        HelperNumberService,
      ],
      exports: [
        HelperArrayService,
        HelperStringService,
        HelperDateService,
        HelperEncryptionService,
        HelperHashService,
        HelperNumberService,
      ],
      controllers: [],
      imports: [],
    };
  }
}
