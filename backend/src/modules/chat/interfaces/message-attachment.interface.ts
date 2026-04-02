export interface IMessageAttachment {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  thumbnailUrl?: string;
}
