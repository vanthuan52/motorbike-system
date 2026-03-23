import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { IMediaService } from '../interfaces/media.interface';
import { MediaCreateRequestDto } from '../dtos/request/media.create.request.dto';
import { MediaUpdateRequestDto } from '../dtos/request/media.update.request.dto';
import { MediaUpdateStatusRequestDto } from '../dtos/request/media.update-status.request.dto';
import {
  EnumMediaStatus,
  EnumMediaType,
  EnumMediaPurpose,
} from '../enums/media.enum';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { EnumAwsS3Accessibility } from '@/common/aws/enums/aws.enum';
import {
  MediaAllowedImageTypes,
  MediaAllowedVideoTypes,
  MediaAllowedDocumentTypes,
  MediaAllowedAudioTypes,
} from '../constants/media.constant';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { Media, Prisma } from '@/generated/prisma-client';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';

/**
 * Media service
 * @description Handles business logic for media operations
 */
@Injectable()
export class MediaService implements IMediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.MediaSelect,
      Prisma.MediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: Media[]; total: number }> {
    const { data, count } =
      await this.mediaRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, total: count || 0 };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.MediaSelect,
      Prisma.MediaWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: Media[]; total?: number }> {
    const { data, count } =
      await this.mediaRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, total: count || 0 };
  }

  async findOneById(id: string): Promise<Media | null> {
    return this.mediaRepository.findOneById(id);
  }

  async findByKey(key: string): Promise<Media | null> {
    return this.mediaRepository.findByKey(key);
  }

  async create(dto: MediaCreateRequestDto): Promise<DatabaseIdDto> {
    const created = await this.mediaRepository.create({
      key: dto.key,
      filename: dto.filename,
      mimeType: dto.mimeType,
      size: dto.size,
      extension: dto.extension.toLowerCase(),
      bucket: dto.bucket,
      completedUrl: dto.completedUrl,
      cdnUrl: dto.cdnUrl,
      type: this.determineMediaType(dto.mimeType),
      purpose: dto.purpose || EnumMediaPurpose.General,
      status: EnumMediaStatus.pending,
      accessibility: dto.access || EnumAwsS3Accessibility.public,
    });

    return { _id: created.id };
  }

  async createFromS3(
    s3Data: AwsS3Dto,
    filename: string,
    purpose: EnumMediaPurpose = EnumMediaPurpose.General,
    ownerId?: string,
    ownerType?: string,
  ): Promise<DatabaseIdDto> {
    const created = await this.mediaRepository.create({
      key: s3Data.key,
      filename: filename,
      mimeType: s3Data.mime,
      size: s3Data.size,
      extension: s3Data.extension.toLowerCase(),
      bucket: s3Data.bucket,
      completedUrl: s3Data.completedUrl,
      cdnUrl: s3Data.cdnUrl,
      type: this.determineMediaType(s3Data.mime),
      purpose: purpose,
      status: EnumMediaStatus.pending,
      accessibility: s3Data.access,
    });

    return { _id: created.id };
  }

  async update(
    id: string,
    dto: MediaUpdateRequestDto
  ): Promise<void> {
    const media = await this.findOneByIdOrFail(id);

    const updateData: any = {};
    if (dto.filename !== undefined) updateData.filename = dto.filename;
    if (dto.purpose !== undefined) updateData.purpose = dto.purpose;

    if (Object.keys(updateData).length > 0) {
      await this.mediaRepository.update(id, updateData);
    }
  }

  async updateStatus(
    id: string,
    { status }: MediaUpdateStatusRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.mediaRepository.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.mediaRepository.delete(id);
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Determine media type from MIME type
   * @param mimeType MIME type string
   * @returns Media type category
   */
  determineMediaType(mimeType: string): EnumMediaType {
    const normalizedMime = mimeType.toLowerCase();

    if (
      MediaAllowedImageTypes.some((type) => normalizedMime.startsWith(type))
    ) {
      return EnumMediaType.image;
    }

    if (
      MediaAllowedVideoTypes.some((type) => normalizedMime.startsWith(type))
    ) {
      return EnumMediaType.video;
    }

    if (
      MediaAllowedDocumentTypes.some((type) => normalizedMime.startsWith(type))
    ) {
      return EnumMediaType.document;
    }

    if (
      MediaAllowedAudioTypes.some((type) => normalizedMime.startsWith(type))
    ) {
      return EnumMediaType.audio;
    }

    // Fallback: check prefix
    if (normalizedMime.startsWith('image/')) {
      return EnumMediaType.image;
    }
    if (normalizedMime.startsWith('video/')) {
      return EnumMediaType.video;
    }
    if (normalizedMime.startsWith('audio/')) {
      return EnumMediaType.audio;
    }

    return EnumMediaType.other;
  }

  private async findOneByIdOrFail(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOneById(id);

    if (!media) {
      throw new NotFoundException({
        message: 'media.error.notFound',
      });
    }

    return media;
  }
}


    if (
      MediaAllowedDocumentTypes.some((type) => normalizedMime.startsWith(type))
    ) {
      return EnumMediaType.document;
    }

    if (
      MediaAllowedAudioTypes.some((type) => normalizedMime.startsWith(type))
    ) {
      return EnumMediaType.audio;
    }

    // Fallback: check prefix
    if (normalizedMime.startsWith('image/')) {
      return EnumMediaType.image;
    }
    if (normalizedMime.startsWith('video/')) {
      return EnumMediaType.video;
    }
    if (normalizedMime.startsWith('audio/')) {
      return EnumMediaType.audio;
    }

    return EnumMediaType.other;
  }

  // ============================================
  // Mapping Methods
  // ============================================

  /**
   * Map media document to embedded DTO
   * @description Creates a lightweight representation for embedding in other entities
   */
  mapToEmbedded(doc: MediaDoc | IMediaEntity): MediaEmbeddedResponseDto {
    const data = doc instanceof Document ? doc.toObject() : doc;

    return plainToInstance(MediaEmbeddedResponseDto, {
      _id: data._id,
      key: data.key,
      mimeType: data.mimeType,
      completedUrl: data.completedUrl,
      cdnUrl: data.cdnUrl,
    });
  }

  /**
   * Map array of media documents to embedded DTOs
   */
  mapToEmbeddedList(
    docs: MediaDoc[] | IMediaEntity[],
  ): MediaEmbeddedResponseDto[] {
    return docs.map((doc) => this.mapToEmbedded(doc));
  }

  /**
   * Map media document to full get response DTO
   */
  mapGet(doc: MediaDoc | IMediaEntity): MediaGetResponseDto {
    return plainToInstance(
      MediaGetResponseDto,
      doc instanceof Document ? doc.toObject() : doc,
    );
  }

  /**
   * Map array of media documents to list response DTOs
   */
  mapList(docs: MediaDoc[] | IMediaEntity[]): MediaListResponseDto[] {
    return plainToInstance(
      MediaListResponseDto,
      docs.map((doc) => (doc instanceof Document ? doc.toObject() : doc)),
    );
  }
}
