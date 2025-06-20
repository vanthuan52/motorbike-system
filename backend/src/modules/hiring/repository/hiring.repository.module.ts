import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HiringEntity, HiringSchema } from '../entities/hiring.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { HiringRepository } from './hiring.repository';

@Module({
  providers: [HiringRepository],
  exports: [HiringRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: HiringEntity.name, schema: HiringSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class HiringRepositoryModule {}
