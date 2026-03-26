import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MediaModel } from '../models/media.model';
import { MediaEmbeddedResponseDto } from '../dtos/response/media.embedded.response.dto';
import { MediaGetResponseDto } from '../dtos/response/media.get.response.dto';
import { MediaListResponseDto } from '../dtos/response/media.list.response.dto';

@Injectable()
export class UserVehicleUtil {
  /**
   * Map media document to embedded DTO
   * @description Creates a lightweight representation for embedding in other entities
   */
  mapToEmbedded(doc: MediaModel): MediaEmbeddedResponseDto {
    return plainToInstance(MediaEmbeddedResponseDto, doc);
  }

  /**
   * Map array of media documents to embedded DTOs
   */
  mapToEmbeddedList(docs: MediaModel[]): MediaEmbeddedResponseDto[] {
    return docs.map(doc => this.mapToEmbedded(doc));
  }

  /**
   * Map media document to full get response DTO
   */
  mapGet(doc: MediaModel): MediaGetResponseDto {
    return plainToInstance(MediaGetResponseDto, doc);
  }

  /**
   * Map array of media documents to list response DTOs
   */
  mapList(docs: MediaModel[]): MediaListResponseDto[] {
    return plainToInstance(MediaListResponseDto, docs);
  }
}
