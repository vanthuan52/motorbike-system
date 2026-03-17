import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PipelineStage } from 'mongoose';
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
import { HelperService } from '@/common/helper/services/helper.service';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { ServiceCategoryTableName } from '@/modules/service-category/entities/service-category.entity';
import { VehicleServiceUtil } from '../utils/vehicle-service.util';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '../enums/vehicle-service.status-code.enum';

@Injectable()
export class VehicleServiceService implements IVehicleServiceService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleServiceRepository: VehicleServiceRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
  ) {
    this.uploadPath =
      this.configService.get<string>('vehicleService.uploadPath') || '';
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

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleServiceDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [vehicleServices, total] = await Promise.all([
      this.vehicleServiceRepository.findAll<VehicleServiceDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.vehicleServiceRepository.getTotal(find),
    ]);

    return {
      data: vehicleServices,
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
  ): Promise<{ data: VehicleServiceDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...filters };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.vehicleServiceRepository.findAllCursor<VehicleServiceDoc>(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: true,
      }),
      includeCount
        ? this.vehicleServiceRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data.slice(0, limit);

    return { data: items, total: count };
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
        $match: find as {},
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
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc> {
    const vehicleService = await this.findOneByIdOrFail(id, options);
    return vehicleService;
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
  ): Promise<VehicleServiceDoc> {
    const vehicleService =
      await this.vehicleServiceRepository.findOne<VehicleServiceDoc>(
        find,
        options,
      );
    if (!vehicleService) {
      return null as any;
    }
    return vehicleService;
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
    // Check slug conflict
    const existingSlug = await this.vehicleServiceRepository.findOne({ slug });
    if (existingSlug) {
      throw new ConflictException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'vehicle-service.error.slugExisted',
      });
    }

    const create: VehicleServiceEntity = new VehicleServiceEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.description = description;
    create.order = order;
    create.serviceCategory = serviceCategory;
    create.checklistItems = checklistItems;
    create.status = ENUM_VEHICLE_SERVICE_STATUS.ACTIVE;

    const created =
      await this.vehicleServiceRepository.create<VehicleServiceEntity>(
        create,
        options,
      );

    return created;
  }

  async update(
    id: string,
    {
      name,
      slug,
      description,
      order,
      serviceCategory,
      checklistItems,
    }: VehicleServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    // Check slug conflict if slug is being updated
    if (slug && slug !== repository.slug) {
      const existingSlug = await this.vehicleServiceRepository.findOne({
        slug,
      });
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ConflictException({
          statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'vehicle-service.error.slugExisted',
        });
      }
    }

    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    repository.serviceCategory = serviceCategory ?? repository.serviceCategory;
    repository.checklistItems = checklistItems ?? repository.checklistItems;

    await this.vehicleServiceRepository.save(repository, options);
  }

  async updateStatus(
    id: string,
    { status }: VehicleServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.vehicleServiceRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseDeleteOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.vehicleServiceRepository.delete(
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

  async findBySlug(slug: string): Promise<VehicleServiceDoc> {
    const vehicleService =
      await this.vehicleServiceRepository.findOneBySlug(slug);
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    }
    return vehicleService;
  }

  createRandomFilenamePhoto(
    vehicleService: string,
    { mime }: VehicleServiceUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace(
      '{vehicleService}',
      vehicleService,
    );
    const randomPath = this.helperService.randomString(10);
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
    return this.vehicleServiceRepository.save(repository, options);
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleServiceDoc> {
    const vehicleService =
      await this.vehicleServiceRepository.findOneById<VehicleServiceDoc>(
        id,
        options,
      );
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    }
    return vehicleService;
  }
}
