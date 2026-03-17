import { Model } from 'mongoose';
import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { MediaDoc, MediaEntity } from '../entities/media.entity';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

/**
 * Media repository
 * @description Handles database operations for media entities
 */
export class MediaRepository extends DatabaseRepositoryBase<
  MediaEntity,
  MediaDoc
> {
  constructor(
    @InjectDatabaseModel(MediaEntity.name)
    private readonly mediaModel: Model<MediaEntity>,
  ) {
    super(mediaModel);
  }

  /**
   * Find media by S3 key
   * @param key S3 object key
   * @returns Media document or null
   */
  async findOneByKey(key: string): Promise<MediaDoc | null> {
    return this.mediaModel.findOne({ key, deleted: false }).exec();
  }

  /**
   * Find all media by owner
   * @param ownerId Owner entity ID
   * @param ownerType Owner entity type
   * @returns Array of media documents
   */
  async findByOwner(ownerId: string, ownerType: string): Promise<MediaDoc[]> {
    return this.mediaModel
      .find({ ownerId, ownerType, deleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }
}
