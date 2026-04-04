export interface IMessageAttachment {
  cdnUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  thumbnailCdnUrl?: string;
}
