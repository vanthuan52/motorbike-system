import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehicleServiceRepository } from '../repository/vehicle-service.repository';
import { IVehicleServiceService } from '../interfaces/vehicle-service.service.interface';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { EnumVehicleServiceStatus } from '../enums/vehicle-service.enum';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { VehicleServiceUploadPhotoRequestDto } from '../dtos/request/vehicle-service.upload-photo.request.dto';
import { HelperService } from '@/common/helper/services/helper.service';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleServiceUtil } from '../utils/vehicle-service.util';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IVehicleServiceListFilters } from '../interfaces/vehicle-service.filter.interface';
import { EnumVehicleServiceStatusCodeError } from '../enums/vehicle-service.status-code.enum';
import { VehicleServiceModel } from '../models/vehicle-service.model';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class VehicleServiceService implements IVehicleServiceService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleServiceRepository: VehicleServiceRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly vehicleServiceUtil: VehicleServiceUtil
  ) {
    this.uploadPath =
      this.configService.get<string>('vehicleService.uploadPath') || '';
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: IVehicleServiceListFilters
  ): Promise<IPaginationOffsetReturn<VehicleServiceModel>> {
    return this.vehicleServiceRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: IVehicleServiceListFilters
  ): Promise<IPaginationCursorReturn<VehicleServiceModel>> {
    return this.vehicleServiceRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<VehicleServiceModel> {
    const vehicleService = await this.vehicleServiceRepository.findOneById(id);
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: EnumVehicleServiceStatusCodeError.notFound,
        message: 'vehicle-service.error.notFound',
      });
    }
    return vehicleService;
  }

  async findOne(
    find: Prisma.VehicleServiceWhereInput
  ): Promise<VehicleServiceModel | null> {
    return this.vehicleServiceRepository.findOne(find);
  }

  async create(
    payload: VehicleServiceCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<VehicleServiceModel> {
    // Check slug conflict
    const existingSlug = await this.vehicleServiceRepository.findOneBySlug(
      payload.slug
    );
    if (existingSlug) {
      throw new ConflictException({
        statusCode: EnumVehicleServiceStatusCodeError.slugExisted,
        message: 'vehicle-service.error.slugExisted',
      });
    }

    try {
      const created = await this.vehicleServiceRepository.create({
        name: payload.name,
        slug: payload.slug.toLowerCase(),
        description: payload.description,
        orderBy: payload.orderBy ?? 0,
        status: payload.status
          ? payload.status
          : EnumVehicleServiceStatus.active,
        serviceCategory: {
          connect: { id: payload.serviceCategory },
        },
        checklistItems: {
          connect: payload.checklistItems.map(id => ({ id })),
        },
        createdBy: createdBy,
      });
      return created;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException({
          statusCode: EnumVehicleServiceStatusCodeError.notFound,
          message: 'vehicle-service.error.relationNotFound',
        });
      }
      throw error;
    }
  }

  async update(
    id: string,
    payload: VehicleServiceUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleServiceModel> {
    const vehicleService = await this.findOneById(id);

    // Check slug conflict if slug is being updated
    if (payload.slug && payload.slug !== vehicleService.slug) {
      const existingSlug = await this.vehicleServiceRepository.findOneBySlug(
        payload.slug
      );
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException({
          statusCode: EnumVehicleServiceStatusCodeError.slugExisted,
          message: 'vehicle-service.error.slugExisted',
        });
      }
    }

    const updateData: Prisma.VehicleServiceUpdateInput = {
      name: payload.name ?? undefined,
      slug: payload.slug ? payload.slug.toLowerCase() : undefined,
      description: payload.description ?? undefined,
      orderBy: payload.orderBy ?? undefined,
      serviceCategory: payload.serviceCategory
        ? { connect: { id: payload.serviceCategory } }
        : undefined,
      checklistItems: payload.checklistItems
        ? { set: payload.checklistItems.map(itemId => ({ id: itemId })) }
        : undefined,
      updatedBy: updatedBy,
    };

    try {
      const updated = await this.vehicleServiceRepository.update(
        id,
        updateData
      );
      return updated;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException({
          statusCode: EnumVehicleServiceStatusCodeError.notFound,
          message: 'vehicle-service.error.relationNotFound',
        });
      }
      throw error;
    }
  }

  async updateStatus(
    id: string,
    payload: VehicleServiceUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleServiceModel> {
    await this.findOneById(id);
    const updated = await this.vehicleServiceRepository.update(id, {
      status: payload.status,
      updatedBy: updatedBy,
    });
    return updated;
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<VehicleServiceModel> {
    await this.findOneById(id);
    const deleted = await this.vehicleServiceRepository.update(id, {
      deletedAt: new Date(),
      deletedBy: deletedBy,
    });
    return deleted;
  }

  async findBySlug(slug: string): Promise<VehicleServiceModel> {
    const vehicleService =
      await this.vehicleServiceRepository.findOneBySlug(slug);
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: EnumVehicleServiceStatusCodeError.notFound,
        message: 'vehicle-service.error.notFound',
      });
    }
    return vehicleService;
  }

  async findAll(
    where: Prisma.VehicleServiceWhereInput
  ): Promise<VehicleServiceModel[]> {
    return this.vehicleServiceRepository.findAll(where);
  }

  createRandomFilenamePhoto(
    vehicleService: string,
    { mime }: VehicleServiceUploadPhotoRequestDto
  ): string {
    let path: string = this.uploadPath.replace(
      '{vehicleService}',
      vehicleService
    );
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(id: string, photo: AwsS3Dto): Promise<VehicleServiceModel> {
    return this.vehicleServiceRepository.update(id, {
      photo: photo.completedUrl,
    });
  }
}
