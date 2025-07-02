import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { PartDoc } from '../entities/part.entity';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartGetResponseDto } from '../dtos/response/part.get.response.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { PartUploadPhotoRequestDto } from '../dtos/request/part.upload-photo.request.dto';

export interface IPartService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartDoc[]>;

  findOneById(_id: string, options?: IDatabaseOptions): Promise<PartDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: PartCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<PartDoc>;

  update(
    repository: PartDoc,
    payload: PartUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc>;

  softDelete(
    repository: PartDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  createSlug(name: string): string;

  updatePhoto(
    repository: PartDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc>;

  createRandomFilenamePhoto(
    user: string,
    { mime }: PartUploadPhotoRequestDto,
  ): string;

  mapList(data: PartDoc[]): PartListResponseDto[];

  mapGet(data: PartDoc): PartGetResponseDto;
}
