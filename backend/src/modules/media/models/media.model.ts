import { EnumMediaType, EnumMediaPurpose, EnumMediaAccessibility } from '../enums/media.enum';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class MediaModel {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  extension: string;
  bucket: string;
  cdnUrl?: string;
  completedUrl: string;
  type: EnumMediaType;
  purpose: EnumMediaPurpose;
  status: EnumStatus;
  accessibility: EnumMediaAccessibility;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
