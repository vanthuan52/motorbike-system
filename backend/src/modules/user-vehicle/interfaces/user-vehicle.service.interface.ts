import { UserVehicle, Prisma } from '@/generated/prisma-client';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IUserVehicleService {
  findAll(find?: Prisma.UserVehicleWhereInput): Promise<UserVehicle[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: UserVehicle[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: UserVehicle[]; total?: number }>;

  findAllWithVehicleModel(
    find?: Prisma.UserVehicleWhereInput,
  ): Promise<UserVehicle[]>;

  getTotalWithVehicleModel(
    find?: Prisma.UserVehicleWhereInput,
  ): Promise<number>;

  findOneById(id: string): Promise<UserVehicle>;

  findOneWithVehicleModelById(id: string): Promise<UserVehicle | null>;

  findOne(find: Prisma.UserVehicleWhereInput): Promise<UserVehicle>;

  getTotal(find?: Prisma.UserVehicleWhereInput): Promise<number>;

  create(payload: UserVehicleCreateRequestDto): Promise<UserVehicle>;

  update(id: string, payload: UserVehicleUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<boolean>;

  softDelete(repository: UserVehicle): Promise<UserVehicle>;

  deleteMany(find?: Prisma.UserVehicleWhereInput): Promise<boolean>;

  updatePhoto(
    repository: UserVehicle,
    photo: AwsS3Dto,
  ): Promise<UserVehicle>;

  createRandomFilenamePhoto(
    user: string,
    payload: UserVehicleUploadPhotoRequestDto,
  ): string;
}
