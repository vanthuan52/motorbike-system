import { VehicleService, Prisma } from '@/generated/prisma-client';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleServiceUploadPhotoRequestDto } from '../dtos/request/vehicle-service.upload-photo.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IVehicleServiceService {
  findAll(find?: Prisma.VehicleServiceWhereInput): Promise<VehicleService[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleService[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleService[]; total?: number }>;

  findOneById(id: string): Promise<VehicleService>;

  findOneWithServiceCategoryById(id: string): Promise<VehicleService | null>;

  findOne(find: Prisma.VehicleServiceWhereInput): Promise<VehicleService>;

  getTotal(find?: Prisma.VehicleServiceWhereInput): Promise<number>;

  create(payload: VehicleServiceCreateRequestDto): Promise<VehicleService>;

  update(id: string, payload: VehicleServiceUpdateRequestDto): Promise<void>;

  updateStatus(id: string, payload: VehicleServiceUpdateStatusRequestDto): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Prisma.VehicleServiceWhereInput): Promise<boolean>;

  findBySlug(slug: string): Promise<VehicleService>;

  createRandomFilenamePhoto(
    vehicleService: string,
    payload: VehicleServiceUploadPhotoRequestDto,
  ): string;

  updatePhoto(
    repository: VehicleService,
    photo: AwsS3Dto,
  ): Promise<VehicleService>;
}
