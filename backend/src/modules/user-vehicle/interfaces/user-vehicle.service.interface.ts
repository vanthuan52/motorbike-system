import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import {
  IPaginationCursorReturn,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { UserVehicleModel } from '../models/user-vehicle.model';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';
import { IUserVehicleListFilters } from './user-vehicle.filter.interface';

export interface IUserVehicleService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: IUserVehicleListFilters
  ): Promise<IPaginationOffsetReturn<UserVehicleModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: IUserVehicleListFilters
  ): Promise<IPaginationCursorReturn<UserVehicleModel>>;

  findOneById(id: string): Promise<UserVehicleModel>;

  findOne(find: Prisma.UserVehicleWhereInput): Promise<UserVehicleModel | null>;

  create(
    payload: UserVehicleCreateRequestDto,
    requestLog: IRequestLog
  ): Promise<UserVehicleModel>;

  update(
    id: string,
    payload: UserVehicleUpdateRequestDto,
    requestLog: IRequestLog
  ): Promise<UserVehicleModel>;

  delete(id: string, requestLog: IRequestLog): Promise<UserVehicleModel>;

  updatePhoto(id: string, photo: AwsS3Dto): Promise<UserVehicleModel>;

  createRandomFilenamePhoto(
    userId: string,
    payload: UserVehicleUploadPhotoRequestDto
  ): string;
}
