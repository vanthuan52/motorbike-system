import { Module } from '@nestjs/common';
import { MediaRepositoryModule } from './repositories/media.repository.module';
import { MediaService } from './services/media.service';

/**
 * Media module
 * @description Provides media metadata management for file storage with S3/MinIO
 *
 * @example
 * // Import in other modules
 * @Module({
 *   imports: [MediaModule],
 * })
 * export class YourModule {}
 *
 * // Inject MediaService
 * constructor(private readonly mediaService: MediaService) {}
 *
 * // Create media from S3 upload
 * const s3Data = await this.awsS3Service.putItem(file);
 * const media = await this.mediaService.createFromS3(s3Data, filename, purpose);
 *
 * // Get embedded DTO for storing in another entity
 * const embedded = this.mediaService.mapToEmbedded(media);
 * user.photo = embedded;
 */
@Module({
  imports: [MediaRepositoryModule],
  controllers: [],
  providers: [MediaService],
  exports: [MediaService, MediaRepositoryModule],
})
export class MediaModule {}
