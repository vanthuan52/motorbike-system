import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehicleModelRepository } from '../repository/vehicle-model.repository';
import { IVehicleModelService } from '../interfaces/vehicle-model.service.interface';
import {
  VehicleModelDoc,
  VehicleModelEntity,
} from '../entities/vehicle-model.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
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
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import { IVehicleModelDoc } from '../interfaces/vehicle-model.interface';
import { VehicleModelUploadPhotoRequestDto } from '../dtos/request/vehicle-model.upload-photo.request.dto';
import { HelperService } from '@/common/helper/services/helper.service';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { VehicleModelUtil } from '../utils/vehicle-model.util';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '../enums/vehicle-model.status-code.enum';

@Injectable()
export class VehicleModelService implements IVehicleModelService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleModelRepository: VehicleModelRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly vehicleModelUtil: VehicleModelUtil,
  ) {
    this.uploadPath =
      this.configService.get<string>('VehicleModel.uploadPath') || '';
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleModelDoc[]> {
    return this.vehicleModelRepository.findAll<VehicleModelDoc>(find, options);
  }

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleModelDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [vehicleModels, total] = await Promise.all([
      this.vehicleModelRepository.findAll<VehicleModelDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.vehicleModelRepository.getTotal(find),
    ]);

    return {
      data: vehicleModels,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleModelDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.vehicleModelRepository.findAllCursor<VehicleModelDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: true,
      }),
      includeCount
        ? this.vehicleModelRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total: count };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc> {
    const vehicleModel = await this.findOneByIdOrFail(id, options);
    return vehicleModel;
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
  ): Promise<VehicleModelDoc> {
    const vehicleModel =
      await this.vehicleModelRepository.findOne<VehicleModelDoc>(find, options);
    if (!vehicleModel) {
      return null as any;
    }
    return vehicleModel;
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
    // Check slug conflict
    const existingSlug = await this.vehicleModelRepository.findOne({ slug });
    if (existingSlug) {
      throw new ConflictException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'vehicle-model.error.slugExisted',
      });
    }

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

    const created =
      await this.vehicleModelRepository.create<VehicleModelEntity>(
        create,
        options,
      );

    return created;
  }

  async update(
    id: string,
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
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    // Check slug conflict if slug is being updated
    if (slug && slug !== repository.slug) {
      const existingSlug = await this.vehicleModelRepository.findOne({ slug });
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ConflictException({
          statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-model.error.slugExisted',
        });
      }
    }

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

    await this.vehicleModelRepository.save(repository, options);
  }

  async updateStatus(
    id: string,
    { status }: VehicleModelUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.vehicleModelRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.vehicleModelRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.vehicleModelRepository.deleteMany(find, options);
    return true;
  }

  async findBySlug(slug: string): Promise<VehicleModelDoc> {
    const vehicleModel = await this.vehicleModelRepository.findOneBySlug(slug);
    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
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
    repository: VehicleModelDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleModelDoc> {
    return this.vehicleModelRepository.save(repository, options);
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleModelDoc> {
    const vehicleModel =
      await this.vehicleModelRepository.findOneById<VehicleModelDoc>(
        id,
        options,
      );
    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }
    return vehicleModel;
  }
}
