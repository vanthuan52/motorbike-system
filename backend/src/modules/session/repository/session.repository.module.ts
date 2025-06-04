import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionEntity, SessionSchema } from '../entities/session.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';
import { SessionRepository } from './session.repository';

@Module({
  providers: [SessionRepository],
  exports: [SessionRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: SessionEntity.name, schema: SessionSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class SessionRepositoryModule {}
