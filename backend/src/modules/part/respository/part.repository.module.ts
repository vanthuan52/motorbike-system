import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { PartRepository } from './part.repository';
import { PartEntity, PartSchema } from '../entities/part.entity';

@Module({
  providers: [PartRepository],
  exports: [PartRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: PartEntity.name, schema: PartSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class PartRepositoryModule {}
