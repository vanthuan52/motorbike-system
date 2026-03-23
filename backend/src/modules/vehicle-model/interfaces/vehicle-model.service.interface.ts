import { VehicleModel, Prisma } from '@/generated/prisma-client';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IVehicleModelService {
  findAll(find?: Prisma.VehicleModelWhereInput): Promise<VehicleModel[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleModel[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleModel[]; total?: number }>;

  findOneById(id: string): Promise<VehicleModel>;

  findOneWithVehicleBrandById(id: string): Promise<VehicleModel | null>;

  findOne(find: Prisma.VehicleModelWhereInput): Promise<VehicleModel>;

  getTotal(find?: Prisma.VehicleModelWhereInput): Promise<number>;

  create(payload: VehicleModelCreateRequestDto): Promise<VehicleModel>;

  update(id: string, payload: VehicleModelUpdateRequestDto): Promise<void>;

  updateStatus(id: string, payload: VehicleModelUpdateStatusRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Prisma.VehicleModelWhereInput): Promise<boolean>;

  findBySlug(slug: string): Promise<VehicleModel>;

  createRandomFilenamePhoto(
    vehicleModel: string,
    payload: VehicleModelUploadPhotoRequestDto,
  ): string;

  updatePhoto(
    repository: VehicleModel,
    photo: AwsS3Dto,
  ): Promise<VehicleModel>;
}
