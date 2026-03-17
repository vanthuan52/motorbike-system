import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaRepository } from './media.repository';
import { MediaEntity, MediaSchema } from '../entities/media.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [MediaRepository],
  exports: [MediaRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: MediaEntity.name, schema: MediaSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class MediaRepositoryModule {}
