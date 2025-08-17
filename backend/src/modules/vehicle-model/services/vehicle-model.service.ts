import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { VehicleModelRepository } from '../repository/vehicle-model.repository';
import { IVehicleModelService } from '../interfaces/vehicle-model.service.interface';
import {
  VehicleModelDoc,
  VehicleModelEntity,
} from '../entities/vehicle-model.entity';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../enums/vehicle-model.enum';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import {
  IVehicleModelDoc,
  IVehicleModelEntity,
} from '../interfaces/vehicle-model.interface';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { VehicleModelGetFullResponseDto } from '../dtos/response/vehicle-model.full.response.dto';
import { VehicleModelGetResponseDto } from '../dtos/response/vehicle-model.get.response.dto';
import { VehicleBrandTableName } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';

@Injectable()
export class VehicleModelService implements IVehicleModelService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {
    this.uploadPath =
      this.configService.get<string>('VehicleModel.uploadPath') || '';
  }
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const vehicleModel = await this.vehicleModelRepository.findOne(
      { name },
      options,
    );
    return !!vehicleModel;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const vehicleModel = await this.vehicleModelRepository.findOne(
      { slug },
      options,
    );
    return !!vehicleModel;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleModelDoc[]> {
    return this.vehicleModelRepository.findAll<VehicleModelDoc>(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleModelDoc[]> {
    return this.vehicleModelRepository.findAll<VehicleModelDoc>(find, options);
  }

  createRawQueryFindAllWithVehicleBrand(
    find?: Record<string, any>,
  ): PipelineStage[] {
    return [
      {
        $lookup: {
          from: VehicleBrandTableName,
          as: 'vehicleBrand',
          foreignField: '_id',
          localField: 'vehicleBrand',
        },
      },
      {
        $unwind: '$vehicleBrand',
      },
      {
        $match: find as FilterQuery<any>,
      },
    ];
  }

  async findAllWithVehicleBrand(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IVehicleModelEntity[]> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithVehicleBrand(find);

    return this.vehicleModelRepository.findAllAggregate<IVehicleModelEntity>(
      pipeline,
      options,
    );
  }

  async getTotalWithVehicleBrand(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    const pipeline: PipelineStage[] =
      this.createRawQueryFindAllWithVehicleBrand(find);

    return this.vehicleModelRepository.getTotalAggregate(pipeline, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc | null> {
    return this.vehicleModelRepository.findOneById<VehicleModelDoc>(
      _id,
      options,
    );
  }

  async findOneWithVehicleBrandById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IVehicleModelDoc | null> {
    return this.vehicleModelRepository.findOneById<IVehicleModelDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async join(repository: VehicleModelDoc): Promise<IVehicleModelDoc> {
    return this.vehicleModelRepository.join(
      repository,
      this.vehicleModelRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc | null> {
    return this.vehicleModelRepository.findOne<VehicleModelDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.vehicleModelRepository.getTotal(find, options);
  }

  async create(
    {
      name,
      fullName,
      slug,
      description,
      engineDisplacement,
      modelYear,
      order,
      status,
      type,
      fuelType,
      yearStart,
      yearEnd,
      vehicleBrand,
    }: VehicleModelCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleModelDoc> {
    const create: VehicleModelEntity = new VehicleModelEntity();
    create.name = name;
    create.fullName = fullName;
    create.slug = slug.toLowerCase();
    create.description = description;
    create.engineDisplacement = engineDisplacement;
    create.modelYear = modelYear;
    create.order = order;
    create.vehicleBrand = vehicleBrand;
    create.status = status ? status : ENUM_VEHICLE_MODEL_STATUS.ACTIVE;
    create.type = type ? type : ENUM_VEHICLE_MODEL_TYPE.UNKNOWN;
    create.fuelType = fuelType
      ? fuelType
      : ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN;
    create.yearStart = yearStart;
    create.yearEnd = yearEnd;

    return this.vehicleModelRepository.create<VehicleModelEntity>(
      create,
      options,
    );
  }

  async update(
    repository: VehicleModelDoc,
    {
      name,
      fullName,
      slug,
      description,
      engineDisplacement,
      modelYear,
      order,
      type,
      fuelType,
      yearStart,
      yearEnd,
      vehicleBrand,
    }: VehicleModelUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc> {
    repository.name = name ?? repository.name;
    repository.fullName = fullName ?? repository.fullName;
    repository.slug = slug ?? repository.slug;
    repository.description = description ?? repository.description;
    repository.engineDisplacement =
      engineDisplacement ?? repository.engineDisplacement;
    repository.modelYear = modelYear ?? repository.modelYear;
    repository.order = order ?? repository.order;
    repository.vehicleBrand = vehicleBrand ?? repository.vehicleBrand;
    repository.type = type ?? repository.type;
    repository.fuelType = fuelType ?? repository.fuelType;
    repository.yearStart = yearStart ?? repository.yearStart;
    repository.yearEnd = yearEnd ?? repository.yearEnd;

    return this.vehicleModelRepository.save(repository, options);
  }

  async softDelete(
    repository: VehicleModelDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc> {
    return this.vehicleModelRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.vehicleModelRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: VehicleModelDoc,
    { status }: VehicleModelUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc> {
    repository.status = status;

    return this.vehicleModelRepository.save(repository, options);
  }

  async findBySlug(slug: string): Promise<VehicleModelDoc | null> {
    return this.vehicleModelRepository.findOneBySlug(slug);
  }

  createRandomFilenamePhoto(
    vehicleModel: string,
    { mime }: VehicleModelUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{vehicleModel}', vehicleModel);
    const randomPath = this.helperStringService.random(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
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
    vehicleModel: VehicleModelDoc[] | IVehicleModelEntity[],
  ): VehicleModelListResponseDto[] {
    return plainToInstance(
      VehicleModelListResponseDto,
      vehicleModel.map((p: VehicleModelDoc | IVehicleModelEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    vehicleModel: VehicleModelDoc | IVehicleModelEntity,
  ): VehicleModelGetResponseDto {
    return plainToInstance(
      VehicleModelGetResponseDto,
      typeof (vehicleModel as any).toObject === 'function'
        ? (vehicleModel as any).toObject()
        : vehicleModel,
    );
  }

  mapGetPopulate(
    vehicleModel: VehicleModelDoc | IVehicleModelEntity,
  ): VehicleModelGetFullResponseDto {
    return plainToInstance(
      VehicleModelGetFullResponseDto,
      typeof (vehicleModel as any).toObject === 'function'
        ? (vehicleModel as any).toObject()
        : vehicleModel,
    );
  }

  async updatePhoto(
    repository: VehicleModelDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc> {
    repository.photo = {
      ...photo,
      size: new Types.Decimal128(photo.size.toString()),
    };

    return this.vehicleModelRepository.save(repository, options);
  }
}
