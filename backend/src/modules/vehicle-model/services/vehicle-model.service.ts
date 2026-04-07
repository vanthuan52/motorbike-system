import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehicleModelRepository } from '../repository/vehicle-model.repository';
import { IVehicleModelService } from '../interfaces/vehicle-model.service.interface';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import {
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
} from '../enums/vehicle-model.enum';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import { HelperService } from '@/common/helper/services/helper.service';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleModelUtil } from '../utils/vehicle-model.util';
import {
  IPaginationCursorReturn,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumVehicleModelStatusCodeError } from '../enums/vehicle-model.status-code.enum';
import { VehicleBrandRepository } from '@/modules/vehicle-brand/repository/vehicle-brand.repository';
import { VehicleModelModel } from '../models/vehicle-model.model';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';

import { IVehicleModelListFilters } from '../interfaces/vehicle-model.filter.interface';

@Injectable()
export class VehicleModelService implements IVehicleModelService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly vehicleModelUtil: VehicleModelUtil,
    private readonly vehicleBrandRepository: VehicleBrandRepository
  ) {
    this.uploadPath =
      this.configService.get<string>('VehicleModel.uploadPath') || '';
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: IVehicleModelListFilters
  ): Promise<IPaginationOffsetReturn<VehicleModelModel>> {
    return this.vehicleModelRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: IVehicleModelListFilters
  ): Promise<IPaginationCursorReturn<VehicleModelModel>> {
    return this.vehicleModelRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<VehicleModelModel> {
    const vehicleModel = await this.vehicleModelRepository.findOneById(id);
    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: EnumVehicleModelStatusCodeError.notFound,
        message: 'vehicle-model.error.notFound',
      });
    }
    return vehicleModel;
  }

  async findOne(
    find: Prisma.VehicleModelWhereInput
  ): Promise<VehicleModelModel | null> {
    return this.vehicleModelRepository.findOne(find);
  }

  async create(
    payload: VehicleModelCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<VehicleModelModel> {
    // Check slug conflict
    const existingSlug = await this.vehicleModelRepository.findOneBySlug(
      payload.slug
    );
    if (existingSlug) {
      throw new ConflictException({
        statusCode: EnumVehicleModelStatusCodeError.slugExisted,
        message: 'vehicle-model.error.slugExisted',
      });
    }

    // Check brand
    if (payload.vehicleBrand) {
      const brand = await this.vehicleBrandRepository.findOneById(
        payload.vehicleBrand
      );
      if (!brand) {
        throw new NotFoundException({
          statusCode: EnumVehicleModelStatusCodeError.notFound,
          message: 'vehicle-brand.error.notFound',
        });
      }
    }

    const created = await this.vehicleModelRepository.create({
      name: payload.name,
      fullName: payload.fullName || '',
      slug: payload.slug.toLowerCase(),
      description: payload.description,
      engineDisplacement: payload.engineDisplacement,
      modelYear: payload.modelYear,
      orderBy: payload.orderBy ?? 0,
      vehicleBrand: { connect: { id: payload.vehicleBrand } },
      status: payload.status ? payload.status : EnumVehicleModelStatus.active,
      type: payload.type ? payload.type : EnumVehicleModelType.unknown,
      fuelType: payload.fuelType
        ? payload.fuelType
        : EnumVehicleModelFuelType.unknown,
      yearStart: payload.yearStart,
      yearEnd: payload.yearEnd,
      createdBy: createdBy,
    });

    return created;
  }

  async update(
    id: string,
    payload: VehicleModelUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleModelModel> {
    const vehicleModel = await this.findOneById(id);

    // Check slug conflict if slug is being updated
    if (payload.slug && payload.slug !== vehicleModel.slug) {
      const existingSlug = await this.vehicleModelRepository.findOneBySlug(
        payload.slug
      );
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException({
          statusCode: EnumVehicleModelStatusCodeError.slugExisted,
          message: 'vehicle-model.error.slugExisted',
        });
      }
    }

    if (payload.vehicleBrand) {
      const brand = await this.vehicleBrandRepository.findOneById(
        payload.vehicleBrand
      );
      if (!brand) {
        throw new NotFoundException({
          statusCode: EnumVehicleModelStatusCodeError.notFound,
          message: 'vehicle-brand.error.notFound',
        });
      }
    }

    const updateData: Prisma.VehicleModelUpdateInput = {
      name: payload.name ?? undefined,
      fullName: payload.fullName ?? undefined,
      slug: payload.slug ? payload.slug.toLowerCase() : undefined,
      description: payload.description ?? undefined,
      engineDisplacement: payload.engineDisplacement ?? undefined,
      modelYear: payload.modelYear ?? undefined,
      orderBy: payload.orderBy ?? undefined,
      vehicleBrand: payload.vehicleBrand
        ? { connect: { id: payload.vehicleBrand } }
        : undefined,
      type: payload.type ?? undefined,
      fuelType: payload.fuelType ?? undefined,
      yearStart: payload.yearStart ?? undefined,
      yearEnd: payload.yearEnd ?? undefined,
      updatedBy: updatedBy,
    };

    const updated = await this.vehicleModelRepository.update(id, updateData);
    return updated;
  }

  async updateStatus(
    id: string,
    payload: VehicleModelUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleModelModel> {
    await this.findOneById(id);
    const updated = await this.vehicleModelRepository.update(id, {
      status: payload.status,
      updatedBy: updatedBy,
    });
    return updated;
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<VehicleModelModel> {
    await this.findOneById(id);
    const deleted = await this.vehicleModelRepository.update(id, {
      deletedAt: new Date(),
      deletedBy: deletedBy,
    });
    return deleted;
  }

  async findBySlug(slug: string): Promise<VehicleModelModel> {
    const vehicleModel = await this.vehicleModelRepository.findOneBySlug(slug);
    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: EnumVehicleModelStatusCodeError.notFound,
        message: 'vehicle-model.error.notFound',
      });
    }
    return vehicleModel;
  }

  createRandomFilenamePhoto(
    vehicleModel: string,
    { mime }: VehicleModelUploadPhotoRequestDto
  ): string {
    let path: string = this.uploadPath.replace('{vehicleModel}', vehicleModel);
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async findAll(
    where: Prisma.VehicleModelWhereInput
  ): Promise<VehicleModelModel[]> {
    return this.vehicleModelRepository.findAll(where);
  }
}
