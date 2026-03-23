import {
  Injectable,
  NotFoundException,
  ConflictException,
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
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumVehicleModelStatusCodeError } from '../enums/vehicle-model.status-code.enum';
import { VehicleModel, Prisma } from '@/generated/prisma-client';
import { VehicleBrandRepository } from '@/modules/vehicle-brand/repository/vehicle-brand.repository';

@Injectable()
export class VehicleModelService implements IVehicleModelService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly vehicleModelUtil: VehicleModelUtil,
    private readonly vehicleBrandRepository: VehicleBrandRepository, // injected
  ) {
    this.uploadPath =
      this.configService.get<string>('VehicleModel.uploadPath') || '';
  }

  async findAll(find?: Prisma.VehicleModelWhereInput): Promise<VehicleModel[]> {
    return this.vehicleModelRepository.findAll({ where: find } as any);
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleModel[]; total: number }> {
    const { data, count } =
      await this.vehicleModelRepository.findWithPaginationOffset(
        pagination,
        filters,
      );

    return {
      data,
      total: count,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleModel[]; total?: number }> {
    const { data, count } =
      await this.vehicleModelRepository.findWithPaginationCursor(
        pagination,
        filters,
      );

    return { data, total: count };
  }

  async findOneById(id: string): Promise<VehicleModel> {
    const vehicleModel = await this.findOneByIdOrFail(id);
    return vehicleModel;
  }

  async findOneWithVehicleBrandById(id: string): Promise<VehicleModel | null> {
    return this.vehicleModelRepository.findOneById(id);
  }

  async findOne(find: Prisma.VehicleModelWhereInput): Promise<VehicleModel> {
    const vehicleModel = await this.vehicleModelRepository.findOne(find);
    if (!vehicleModel) {
      return null as any;
    }
    return vehicleModel;
  }

  async getTotal(find?: Prisma.VehicleModelWhereInput): Promise<number> {
    return this.vehicleModelRepository.getTotal({ where: find } as any);
  }

  async create(payload: VehicleModelCreateRequestDto): Promise<VehicleModel> {
    // Check slug conflict
    const existingSlug = await this.vehicleModelRepository.findOneBySlug(
      payload.slug,
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
        payload.vehicleBrand,
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
      orderBy: payload.orderBy ? parseInt(payload.orderBy, 10) : 0,
      vehicleBrandId: payload.vehicleBrand,
      status: payload.status ? payload.status : EnumVehicleModelStatus.active,
      type: payload.type ? payload.type : EnumVehicleModelType.unknown,
      fuelType: payload.fuelType
        ? payload.fuelType
        : EnumVehicleModelFuelType.unknown,
      yearStart: payload.yearStart,
      yearEnd: payload.yearEnd,
    });

    return created;
  }

  async update(id: string, payload: VehicleModelUpdateRequestDto): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    // Check slug conflict if slug is being updated
    if (payload.slug && payload.slug !== repository.slug) {
      const existingSlug = await this.vehicleModelRepository.findOneBySlug(
        payload.slug,
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
        payload.vehicleBrand,
      );
      if (!brand) {
        throw new NotFoundException({
          statusCode: EnumVehicleModelStatusCodeError.notFound,
          message: 'vehicle-brand.error.notFound',
        });
      }
    }

    const updateData: Prisma.VehicleModelUpdateInput = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.fullName !== undefined) updateData.fullName = payload.fullName;
    if (payload.slug !== undefined) updateData.slug = payload.slug.toLowerCase();
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.engineDisplacement !== undefined)
      updateData.engineDisplacement = payload.engineDisplacement;
    if (payload.modelYear !== undefined) updateData.modelYear = payload.modelYear;
    if (payload.orderBy !== undefined) updateData.orderBy = parseInt(payload.orderBy, 10);
    if (payload.vehicleBrand !== undefined)
      updateData.vehicleBrandId = payload.vehicleBrand;
    if (payload.type !== undefined) updateData.type = payload.type;
    if (payload.fuelType !== undefined) updateData.fuelType = payload.fuelType;
    if (payload.yearStart !== undefined) updateData.yearStart = payload.yearStart;
    if (payload.yearEnd !== undefined) updateData.yearEnd = payload.yearEnd;

    await this.vehicleModelRepository.update(id, updateData);
  }

  async updateStatus(
    id: string,
    payload: VehicleModelUpdateStatusRequestDto,
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.vehicleModelRepository.update(id, { status: payload.status });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.vehicleModelRepository.update(id, { deletedAt: new Date() } as any);
  }

  async deleteMany(find?: Prisma.VehicleModelWhereInput): Promise<boolean> {
    await this.vehicleModelRepository.deleteMany(find || {});
    return true;
  }

  async findBySlug(slug: string): Promise<VehicleModel> {
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
    { mime }: VehicleModelUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{vehicleModel}', vehicleModel);
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(
    repository: VehicleModel,
    photo: AwsS3Dto,
  ): Promise<VehicleModel> {
    return this.vehicleModelRepository.update(repository.id, {
      photo: {
        ...photo,
        size: photo.size,
      } as any,
    });
  }

  private async findOneByIdOrFail(id: string): Promise<VehicleModel> {
    const vehicleModel = await this.vehicleModelRepository.findOneById(id);
    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: EnumVehicleModelStatusCodeError.notFound,
        message: 'vehicle-model.error.notFound',
      });
    }
    return vehicleModel;
  }
}
