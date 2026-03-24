import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { MediaCreateRequestDto } from '../dtos/request/media.create.request.dto';
import { MediaUpdateStatusRequestDto } from '../dtos/request/media.update-status.request.dto';
import { MediaGetResponseDto } from '../dtos/response/media.get.response.dto';
import { MediaListResponseDto } from '../dtos/response/media.list.response.dto';
import { MediaEmbeddedResponseDto } from '../dtos/response/media.embedded.response.dto';
import { EnumMediaPurpose, EnumMediaType } from '../enums/media.enum';
import { MediaModel } from '../models/media.model';

/**
 * Media service interface
 * @description Defines the contract for media service operations
 */
export interface IMediaService {
  // CRUD Operations
  findAll(find?: Record<string, any>): Promise<MediaModel[]>;

  findOneById(_id: string): Promise<MediaModel | null>;

  findOneByKey(key: string): Promise<MediaModel | null>;

  findByOwner(ownerId: string, ownerType: string): Promise<MediaModel[]>;

  getTotal(find?: Record<string, any>): Promise<number>;

  create(dto: MediaCreateRequestDto): Promise<MediaModel>;

  createFromS3(
    s3Data: AwsS3Dto,
    filename: string,
    purpose?: EnumMediaPurpose,
    ownerId?: string,
    ownerType?: string
  ): Promise<MediaModel>;

  updateStatus(
    repository: MediaModel,
    dto: MediaUpdateStatusRequestDto
  ): Promise<MediaModel>;

  softDelete(repository: MediaModel): Promise<MediaModel>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;

  existByKey(key: string): Promise<boolean>;

  // Utility Methods
  determineMediaType(mimeType: string): EnumMediaType;
}
