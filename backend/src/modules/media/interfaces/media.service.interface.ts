import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { MediaCreateRequestDto } from '../dtos/request/media.create.request.dto';
import { MediaUpdateRequestDto } from '../dtos/request/media.update.request.dto';
import { MediaUpdateStatusRequestDto } from '../dtos/request/media.update-status.request.dto';
import { EnumMediaPurpose, EnumMediaType } from '../enums/media.enum';
import { MediaModel } from '../models/media.model';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { MediaEmbeddedResponseDto } from '../dtos/response/media.embedded.response.dto';
import { MediaGetResponseDto } from '../dtos/response/media.get.response.dto';
import { MediaListResponseDto } from '../dtos/response/media.list.response.dto';
import { Prisma } from '@/generated/prisma-client';

/**
 * Media service interface
 * @description Defines the contract for media service operations
 */
export interface IMediaService {
  // Pagination Operations
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MediaSelect,
      Prisma.MediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<MediaModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MediaSelect,
      Prisma.MediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<MediaModel>>;

  // CRUD Operations
  findOneById(id: string): Promise<MediaModel | null>;

  findByKey(key: string): Promise<MediaModel | null>;

  create(dto: MediaCreateRequestDto): Promise<DatabaseIdDto>;

  createFromS3(
    s3Data: AwsS3Dto,
    filename: string,
    purpose: EnumMediaPurpose,
    ownerId?: string,
    ownerType?: string
  ): Promise<DatabaseIdDto>;

  update(id: string, dto: MediaUpdateRequestDto): Promise<void>;

  updateStatus(id: string, dto: MediaUpdateStatusRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  // Utility Methods
  determineMediaType(mimeType: string): EnumMediaType;

  // Mapping Methods
  mapToEmbedded(doc: MediaModel): MediaEmbeddedResponseDto;

  mapToEmbeddedList(docs: MediaModel[]): MediaEmbeddedResponseDto[];

  mapGet(doc: MediaModel): MediaGetResponseDto;

  mapList(docs: MediaModel[]): MediaListResponseDto[];
}
