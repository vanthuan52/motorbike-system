import { _Object } from '@aws-sdk/client-s3';
import {
  IAwsS3DeleteDirOptions,
  IAwsS3GetItemsOptions,
  IAwsS3Options,
  IAwsS3PresignOptions,
  IAwsS3PutItem,
  IAwsS3PutItemWithAclOptions,
} from './aws.interface';
import { AwsS3Dto } from '../dtos/aws.s3.dto';
import { AwsS3PresignResponseDto } from '../dtos/response/aws.s3-presign.response.dto';
import { AwsS3PresignMultiPartResponseDto } from '../dtos/response/aws.s3-presign-multipart.response.dto';
import { AwsS3ResponseDto } from '../dtos/response/aws.s3-response.dto';
import { AwsS3PresignRequestDto } from '../dtos/request/aws.s3-presign.request.dto';
import { AwsS3MultipartDto } from '../dtos/aws.s3-multipart.dto';

export interface IAwsS3Service {
  onModuleInit(): void;
  checkConnection(options?: IAwsS3Options): Promise<boolean>;
  checkBucket(options?: IAwsS3Options): Promise<boolean>;
  checkItem(key: string, options?: IAwsS3Options): Promise<AwsS3Dto>;
  getItems(path: string, options?: IAwsS3GetItemsOptions): Promise<AwsS3Dto[]>;
  getItem(key: string, options?: IAwsS3Options): Promise<AwsS3Dto>;
  putItem(file: IAwsS3PutItem, options?: IAwsS3Options): Promise<AwsS3Dto>;
  putItemWithAcl(
    file: IAwsS3PutItem,
    options?: IAwsS3PutItemWithAclOptions,
  ): Promise<AwsS3Dto>;
  deleteItem(key: string, options?: IAwsS3Options): Promise<void>;
  deleteItems(keys: string[], options?: IAwsS3Options): Promise<void>;
  deleteDir(
    path: string,
    options?: IAwsS3DeleteDirOptions,
  ): Promise<void | _Object[]>;
  createMultiPart(
    file: IAwsS3PutItem,
    maxPartNumber: number,
    options?: IAwsS3Options,
  ): Promise<AwsS3MultipartDto>;
  createMultiPartWithAcl(
    file: IAwsS3PutItem,
    maxPartNumber: number,
    options?: IAwsS3PutItemWithAclOptions,
  ): Promise<AwsS3MultipartDto>;
  putItemMultiPart(
    multipart: AwsS3MultipartDto,
    partNumber: number,
    file: Buffer,
    options?: IAwsS3Options,
  ): Promise<AwsS3MultipartDto>;
  completeMultipart(
    key: string,
    uploadId: string,
    options?: IAwsS3Options,
  ): Promise<void>;
  abortMultipart(
    key: string,
    uploadId: string,
    options?: IAwsS3Options,
  ): Promise<void>;
  presignPutItem(
    key: string,
    options?: IAwsS3PresignOptions,
  ): Promise<AwsS3PresignResponseDto>;
  presignPutItemMultipart(
    key: string,
    uploadId: string,
    partNumber: number,
    options?: IAwsS3PresignOptions,
  ): Promise<AwsS3PresignMultiPartResponseDto>;
  mapPresign(
    { key, size, duration }: AwsS3PresignRequestDto,
    options?: IAwsS3Options,
  ): AwsS3Dto;
  mapResponse(dto: AwsS3Dto): AwsS3ResponseDto;
}
