import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { VehicleServiceRepository } from '../repository/vehicle-service.repository';
import { IVehicleServiceService } from '../interfaces/vehicle-service.service.interface';
import {
  VehicleServiceDoc,
  VehicleServiceEntity,
} from '../entities/vehicle-service.entity';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../enums/vehicle-service.enum';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import {
  IVehicleServiceDoc,
  IVehicleServiceEntity,
} from '../interfaces/vehicle-service.interface';
import { VehicleServiceUploadPhotoRequestDto } from '../dtos/request/vehicle-service.upload-photo.request.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { ServiceCategoryTableName } from '@/modules/service-category/entities/service-category.entity';
import { VehicleServiceGetFullResponseDto } from '../dtos/response/vehicle-service.full.response.dto';
import { VehicleServiceGetResponseDto } from '../dtos/response/vehicle-service.get.response.dto';

@Injectable()
export class VehicleServiceService implements IVehicleServiceService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleServiceRepository: VehicleServiceRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {
    this.uploadPath =
      this.configService.get<string>('vehicleService.uploadPath') || '';
  }
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const VehicleService = await this.vehicleServiceRepository.findOne(
      { name },
      options,
    );
    return !!VehicleService;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const VehicleService = await this.vehicleServiceRepository.findOne(
      { slug },
      options,
    );
    return !!VehicleService;
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  mapList(
    VehicleService: VehicleServiceDoc[] | IVehicleServiceEntity[],
  ): VehicleServiceListResponseDto[] {
    return plainToInstance(
      VehicleServiceListResponseDto,
      VehicleService.map((p: VehicleServiceDoc | IVehicleServiceEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    VehicleService: VehicleServiceDoc | IVehicleServiceEntity,
  ): VehicleServiceGetResponseDto {
    return plainToInstance(
      VehicleServiceGetResponseDto,
      typeof (VehicleService as any).toObject === 'function'
        ? (VehicleService as any).toObject()
        : VehicleService,
    );
  }

  mapGetPopulate(
    vehicleService: VehicleServiceDoc | IVehicleServiceEntity,
  ): VehicleServiceGetFullResponseDto {
    return plainToInstance(
      VehicleServiceGetFullResponseDto,
      typeof (vehicleService as any).toObject === 'function'
        ? (vehicleService as any).toObject()
        : vehicleService,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleServiceDoc[]> {
    return this.vehicleServiceRepository.findAll<VehicleServiceDoc>(
      find,
      options,
    );
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleServiceDoc[]> {
    return this.vehicleServiceRepository.findAll<VehicleServiceDoc>(
      find,
      options,
    );
  }

  createRawQueryFindAllWithServiceCategory(
    find?: Record<string, any>,
  ): PipelineStage[] {
    return [
      {
        $lookup: {
          from: ServiceCategoryTableName,
          as: 'serviceCategory',
          foreignField: '_id',
          localField: 'serviceCategory',
        },
      },
      {
        $unwind: '$serviceCategory',
      },
      {
        $match: find as FilterQuery<any>,
      },
    ];
  }

  async findAllWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IVehicleServiceEntity[]> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithServiceCategory(find);
    return this.vehicleServiceRepository.findAllAggregate<IVehicleServiceEntity>(
      pipeline,
      options,
    );
  }

  async getTotalWithServiceCategory(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithServiceCategory(find);
    return this.vehicleServiceRepository.getTotalAggregate(pipeline, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc | null> {
    return this.vehicleServiceRepository.findOneById<VehicleServiceDoc>(
      _id,
      options,
    );
  }

  async findOneWithServiceCategoryById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IVehicleServiceDoc | null> {
    return this.vehicleServiceRepository.findOneById<IVehicleServiceDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async join(repository: VehicleServiceDoc): Promise<IVehicleServiceDoc> {
    return this.vehicleServiceRepository.join(
      repository,
      this.vehicleServiceRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc | null> {
    return this.vehicleServiceRepository.findOne<VehicleServiceDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.vehicleServiceRepository.getTotal(find, options);
  }

  async create(
    {
      name,
      slug,
      description,
      order,
      serviceCategory,
      checklistItems,
    }: VehicleServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleServiceDoc> {
    const create: VehicleServiceEntity = new VehicleServiceEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.description = description;
    create.order = order;
    create.serviceCategory = serviceCategory;
    create.checklistItems = checklistItems;
    create.status = ENUM_VEHICLE_SERVICE_STATUS.ACTIVE;

    return this.vehicleServiceRepository.create<VehicleServiceEntity>(
      create,
      options,
    );
  }

  async update(
    repository: VehicleServiceDoc,
    {
      name,
      slug,
      description,
      order,
      serviceCategory,
      checklistItems,
    }: VehicleServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc> {
    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    repository.serviceCategory = serviceCategory ?? repository.serviceCategory;
    repository.checklistItems = checklistItems ?? repository.checklistItems;

    return this.vehicleServiceRepository.save(repository, options);
  }

  async softDelete(
    repository: VehicleServiceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc> {
    return this.vehicleServiceRepository.softDelete(repository, options);
  }

  async delete(
    repository: VehicleServiceDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<VehicleServiceDoc> {
    return this.vehicleServiceRepository.delete(
      { _id: repository._id },
      options,
    );
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.vehicleServiceRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: VehicleServiceDoc,
    { status }: VehicleServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc> {
    repository.status = status;

    return this.vehicleServiceRepository.save(repository, options);
  }

  async findBySlug(slug: string): Promise<VehicleServiceDoc | null> {
    return this.vehicleServiceRepository.findOneBySlug(slug);
  }

  createRandomFilenamePhoto(
    vehicleService: string,
    { mime }: VehicleServiceUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace(
      '{vehicleService}',
      vehicleService,
    );
    const randomPath = this.helperStringService.random(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(
    repository: VehicleServiceDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleServiceDoc> {
    repository.photo = {
      ...photo,
      size: new Types.Decimal128(photo.size.toString()),
    };

    return this.vehicleServiceRepository.save(repository, options);
  }
}
