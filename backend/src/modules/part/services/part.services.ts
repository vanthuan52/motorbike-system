import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';

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
import { IPartService } from '../interfaces/part.service.interface';
import { PartRepository } from '../respository/part.repository';
import { PartDoc, PartEntity } from '../entities/part.entity';
import { IPartDoc, IPartEntity } from '../interfaces/part.interface';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartGetResponseDto } from '../dtos/response/part.get.response.dto';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { ENUM_PART_STATUS } from '../enums/part.enum';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import { PartUploadPhotoRequestDto } from '../dtos/request/part.upload-photo.request.dto';
import { HelperStringService } from '@/common/helper/services/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { VehicleBrandTableName } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';

@Injectable()
export class PartService implements IPartService {
  private readonly uploadPath: string;
  constructor(
    private readonly partRepository: PartRepository,
    private readonly configService: ConfigService,
    private readonly helperStringService: HelperStringService,
  ) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const part = await this.partRepository.findOne({ name }, options);
    return !!part;
  }
  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const part = await this.partRepository.findOne({ slug }, options);
    return !!part;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartDoc[]> {
    return this.partRepository.findAll<PartDoc>(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartDoc[]> {
    return this.partRepository.findAll<PartDoc>(find, options);
  }

  async findAllWithVehicleBrandAndPartType(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IPartEntity[]> {
    return this.partRepository.findAll<IPartEntity>(find, {
      ...options,
      join: true,
    });
  }

  async getTotalWithVehicleBrandAndPartType(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    return this.partRepository.getTotal(find, {
      ...options,
      join: true,
    });
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc | null> {
    return this.partRepository.findOneById<PartDoc>(_id, options);
  }

  async findOneWithPartById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<IPartDoc | null> {
    return this.partRepository.findOneById<IPartDoc>(_id, {
      ...options,
      join: true,
    });
  }

  async join(repository: PartDoc): Promise<IPartDoc> {
    return this.partRepository.join(repository, this.partRepository._join!);
  }
  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc | null> {
    return this.partRepository.findOne<PartDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.partRepository.getTotal(find, options);
  }

  async create(
    {
      name,
      slug,
      vehicleBrand,
      partType,
      order,
      description,
      status,
    }: PartCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<PartDoc> {
    const create: PartEntity = new PartEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.vehicleBrand = vehicleBrand;
    create.partType = partType;
    create.order = order;
    create.description = description;
    create.status = status ? status : ENUM_PART_STATUS.ACTIVE;
    return this.partRepository.create<PartEntity>(create, options);
  }

  async update(
    repository: PartDoc,
    {
      name,
      slug,
      vehicleBrand,
      partType,
      order,
      description,
    }: PartUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc> {
    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.order = order ?? repository.order;
    repository.vehicleBrand = vehicleBrand ?? repository.vehicleBrand;
    repository.partType = partType ?? repository.partType;
    repository.description = description;
    return this.partRepository.save(repository, options);
  }

  async softDelete(
    repository: PartDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc> {
    return this.partRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.partRepository.deleteMany(find, options);
    return true;
  }
  async updateStatus(
    repository: PartDoc,
    { status }: PartUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc> {
    repository.status = status;

    return this.partRepository.save(repository, options);
  }
  async findBySlug(slug: string): Promise<PartDoc | null> {
    return this.partRepository.findOneBySlug(slug);
  }

  createRandomFilenamePhoto(
    part: string,
    { mime }: PartUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{part}', part);
    const randomPath = this.helperStringService.random(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(
    repository: PartDoc,
    photo: AwsS3Dto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartDoc> {
    repository.photo = {
      ...photo,
      size: new Types.Decimal128(photo.size.toString()),
    };

    return this.partRepository.save(repository, options);
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  mapList(part: PartDoc[] | IPartEntity[]): PartListResponseDto[] {
    return plainToInstance(
      PartListResponseDto,
      part.map((p: PartDoc | IPartEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }
  mapGet(part: PartDoc | IPartEntity): PartGetResponseDto {
    return plainToInstance(
      PartGetResponseDto,
      typeof (part as any).toObject === 'function'
        ? (part as any).toObject()
        : part,
    );
  }

  mapGetPopulate(part: PartDoc | IPartEntity): PartGetFullResponseDto {
    return plainToInstance(
      PartGetFullResponseDto,
      typeof (part as any).toObject === 'function'
        ? (part as any).toObject()
        : part,
    );
  }
}
