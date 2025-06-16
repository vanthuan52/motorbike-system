import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartTypeRepository } from './part-type.repository';
import { PartTypeEntity, PartTypeSchema } from '../entities/part-type.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [PartTypeRepository],
  exports: [PartTypeRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: PartTypeEntity.name, schema: PartTypeSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class PartTypeRepositoryModule {}
