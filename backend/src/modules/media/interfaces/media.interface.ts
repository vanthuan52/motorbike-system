import { MediaModel } from '../models/media.model';

export interface IMedia extends MediaModel {}

/**
 * Embedded media interface for storing in other entities
 * @description Lightweight representation of media for embedding in documents
 */
export interface IMediaEmbedded {
  id: string;
  key: string;
  mimeType: string;
  completedUrl?: string;
  cdnUrl?: string;
}
