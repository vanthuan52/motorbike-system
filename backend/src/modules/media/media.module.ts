import { Module } from '@nestjs/common';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repositories/media.repository';
import { MediaAttachmentService } from './services/media-attachment.service';
import { MediaAttachmentRepository } from './repositories/media-attachment.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    MediaRepository,
    MediaService,
    MediaAttachmentRepository,
    MediaAttachmentService,
  ],
  exports: [MediaService, MediaAttachmentService],
})
export class MediaModule {}
