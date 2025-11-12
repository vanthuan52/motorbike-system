import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareAreaRepository } from './care-area.repository';
import { CareAreaEntity, CareAreaSchema } from '../entities/care-area.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [CareAreaRepository],
  exports: [CareAreaRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: CareAreaEntity.name, schema: CareAreaSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CareAreaRepositoryModule {}
