import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { UserVehicleUploadPhotoRequestDto } from '../dtos/request/user-vehicle.upload-photo.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { UserVehicleModel } from '../models/user-vehicle.model';
import { Prisma } from '@/generated/prisma-client';

export interface IUserVehicleService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<UserVehicleModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<UserVehicleModel>>;

  findOneById(id: string): Promise<UserVehicleModel>;

  findOne(find: Prisma.UserVehicleWhereInput): Promise<UserVehicleModel | null>;

  create(payload: UserVehicleCreateRequestDto): Promise<DatabaseIdDto>;

  update(id: string, payload: UserVehicleUpdateRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  updatePhoto(id: string, photo: AwsS3Dto): Promise<UserVehicleModel>;

  createRandomFilenamePhoto(
    userId: string,
    payload: UserVehicleUploadPhotoRequestDto
  ): string;
}
