import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { MediaRepository } from '../repositories/media.repository';
import { IMediaEntity, IMediaService } from '../interfaces/media.interface';
import { MediaDoc, MediaEntity } from '../entities/media.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { MediaCreateRequestDto } from '../dtos/request/media.create.request.dto';
import { MediaUpdateStatusRequestDto } from '../dtos/request/media.update-status.request.dto';
import { MediaUpdateRequestDto } from '../dtos/request/media.update.request.dto';
import {
  EnumMediaStatus,
  EnumMediaType,
  EnumMediaPurpose,
} from '../enums/media.enum';
import { MediaGetResponseDto } from '../dtos/response/media.get.response.dto';
import { MediaListResponseDto } from '../dtos/response/media.list.response.dto';
import { MediaEmbeddedResponseDto } from '../dtos/response/media.embedded.response.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { EnumAwsS3Accessibility } from '@/common/aws/enums/aws.enum';
import {
  MediaAllowedImageTypes,
  MediaAllowedVideoTypes,
  MediaAllowedDocumentTypes,
  MediaAllowedAudioTypes,
} from '../constants/media.constant';

/**
 * Media service
 * @description Handles business logic for media operations
 */
@Injectable()
export class MediaService implements IMediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  // ============================================
  // CRUD Operations
  // ============================================

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MediaDoc[]> {
    return this.mediaRepository.findAll<MediaDoc>(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<MediaDoc | null> {
    return this.mediaRepository.findOneById<MediaDoc>(_id, options);
  }

  async findOneByKey(
    key: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<MediaDoc | null> {
    return this.mediaRepository.findOneByKey(key);
  }

  async findByOwner(
    ownerId: string,
    ownerType: string,
    options?: IDatabaseFindAllOptions,
  ): Promise<MediaDoc[]> {
    return this.mediaRepository.findByOwner(ownerId, ownerType);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.mediaRepository.getTotal(find, options);
  }

  async create(
    dto: MediaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<MediaDoc> {
    const create: MediaEntity = new MediaEntity();
    create.key = dto.key;
    create.filename = dto.filename;
    create.mimeType = dto.mimeType;
    create.size = dto.size;
    create.extension = dto.extension.toLowerCase();
    create.bucket = dto.bucket;
    create.completedUrl = dto.completedUrl;
    create.cdnUrl = dto.cdnUrl;
    create.type = this.determineMediaType(dto.mimeType);
    create.purpose = dto.purpose || EnumMediaPurpose.General;
    create.status = EnumMediaStatus.pending;
    create.access = dto.access || EnumAwsS3Accessibility.public;
    create.ownerId = dto.ownerId;
    create.ownerType = dto.ownerType;

    return this.mediaRepository.create<MediaEntity>(create, options);
  }

  /**
   * Create media record from AwsS3Dto after successful S3 upload
   * @param s3Data Data returned from AwsS3Service
   * @param filename Original filename
   * @param purpose Media purpose
   * @param ownerId Owner entity ID
   * @param ownerType Owner entity type
   * @param options Database options
   * @returns Created media document
   */
  async createFromS3(
    s3Data: AwsS3Dto,
    filename: string,
    purpose: EnumMediaPurpose = EnumMediaPurpose.General,
    ownerId?: string,
    ownerType?: string,
    options?: IDatabaseCreateOptions,
  ): Promise<MediaDoc> {
    const create: MediaEntity = new MediaEntity();
    create.key = s3Data.key;
    create.filename = filename;
    create.mimeType = s3Data.mime;
    create.size = s3Data.size;
    create.extension = s3Data.extension.toLowerCase();
    create.bucket = s3Data.bucket;
    create.completedUrl = s3Data.completedUrl;
    create.cdnUrl = s3Data.cdnUrl;
    create.type = this.determineMediaType(s3Data.mime);
    create.purpose = purpose;
    create.status = EnumMediaStatus.pending;
    create.access = s3Data.access;
    create.ownerId = ownerId;
    create.ownerType = ownerType;

    return this.mediaRepository.create<MediaEntity>(create, options);
  }

  async update(
    repository: MediaDoc,
    dto: MediaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc> {
    if (dto.filename !== undefined) {
      repository.filename = dto.filename;
    }
    if (dto.purpose !== undefined) {
      repository.purpose = dto.purpose;
    }
    if (dto.ownerId !== undefined) {
      repository.ownerId = dto.ownerId;
    }
    if (dto.ownerType !== undefined) {
      repository.ownerType = dto.ownerType;
    }

    return this.mediaRepository.save(repository, options);
  }

  async updateStatus(
    repository: MediaDoc,
    { status }: MediaUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc> {
    repository.status = status;
    return this.mediaRepository.save(repository, options);
  }

  /**
   * Activate media (set status to Active)
   * @description Convenience method to activate media after it's attached to an entity
   */
  async activate(
    repository: MediaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc> {
    repository.status = EnumMediaStatus.active;
    return this.mediaRepository.save(repository, options);
  }

  /**
   * Set owner for media
   * @description Update owner reference and optionally activate the media
   */
  async setOwner(
    repository: MediaDoc,
    ownerId: string,
    ownerType: string,
    activate: boolean = true,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc> {
    repository.ownerId = ownerId;
    repository.ownerType = ownerType;
    if (activate) {
      repository.status = EnumMediaStatus.active;
    }
    return this.mediaRepository.save(repository, options);
  }

  async softDelete(
    repository: MediaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<MediaDoc> {
    return this.mediaRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.mediaRepository.deleteMany(find, options);
    return true;
  }

  async existByKey(
    key: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    return this.mediaRepository.exists({ key }, options);
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
