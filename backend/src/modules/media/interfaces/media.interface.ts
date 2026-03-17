import { MediaDoc, MediaEntity } from '../entities/media.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { MediaCreateRequestDto } from '../dtos/request/media.create.request.dto';
import { MediaUpdateStatusRequestDto } from '../dtos/request/media.update-status.request.dto';
import { MediaGetResponseDto } from '../dtos/response/media.get.response.dto';
import { MediaListResponseDto } from '../dtos/response/media.list.response.dto';
import { MediaEmbeddedResponseDto } from '../dtos/response/media.embedded.response.dto';
import { EnumMediaPurpose, EnumMediaType } from '../enums/media.enum';

/**
 * Embedded media interface for storing in other entities
 * @description Lightweight representation of media for embedding in documents
 */
export interface IMediaEmbedded {
  _id: string;
  key: string;
  mimeType: string;
  completedUrl?: string;
  cdnUrl?: string;
}

/**
 * Full media entity interface
 */
export interface IMediaEntity extends MediaEntity {}

/**
 * Media document interface
 */
export interface IMediaDoc extends MediaDoc {}

/**
 * Media service interface
 * @description Defines the contract for media service operations
 */
export interface IMediaService {
  // CRUD Operations
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MediaDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<MediaDoc | null>;

  findOneByKey(
    key: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<MediaDoc | null>;

  findByOwner(
    ownerId: string,
    ownerType: string,
    options?: IDatabaseFindAllOptions,
  ): Promise<MediaDoc[]>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    dto: MediaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<MediaDoc>;

  createFromS3(
    s3Data: AwsS3Dto,
    filename: string,
    purpose?: EnumMediaPurpose,
    ownerId?: string,
    ownerType?: string,
    options?: IDatabaseCreateOptions,
  ): Promise<MediaDoc>;

  updateStatus(
    repository: MediaDoc,
    dto: MediaUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc>;

  softDelete(
    repository: MediaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByKey(key: string): Promise<boolean>;

  // Utility Methods
  determineMediaType(mimeType: string): EnumMediaType;

  // Mapping Methods
  mapToEmbedded(doc: MediaDoc | IMediaEntity): MediaEmbeddedResponseDto;
  mapToEmbeddedList(
    docs: MediaDoc[] | IMediaEntity[],
  ): MediaEmbeddedResponseDto[];
  mapGet(doc: MediaDoc | IMediaEntity): MediaGetResponseDto;
  mapList(docs: MediaDoc[] | IMediaEntity[]): MediaListResponseDto[];
}
