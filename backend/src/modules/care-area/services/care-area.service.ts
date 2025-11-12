import { Injectable } from '@nestjs/common';
import { CareAreaRepository } from '../repository/care-area.repository';
import { ICareAreaService } from '../interfaces/care-area.service.interface';
import { CareAreaDoc, CareAreaEntity } from '../entities/care-area.entity';
import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { CareAreaGetResponseDto } from '../dtos/response/care-area.get.response.dto';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';
import { ICareAreaEntity } from '../interfaces/care-area.interface';
import { plainToInstance } from 'class-transformer';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '@/common/pagination/enums/pagination.enum';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';

@Injectable()
export class CareAreaService implements ICareAreaService {
  constructor(
    private readonly careAreaRepository: CareAreaRepository,
    private readonly serviceChecklistService: ServiceChecklistService,
  ) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const careArea = await this.careAreaRepository.findOne({ name }, options);
    return !!careArea;
  }

  mapList(
    careArea: CareAreaDoc[] | ICareAreaEntity[],
  ): CareAreaListResponseDto[] {
    return plainToInstance(
      CareAreaListResponseDto,
      careArea.map((p: CareAreaDoc | ICareAreaEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(careArea: CareAreaDoc | ICareAreaEntity): CareAreaGetResponseDto {
    return plainToInstance(
      CareAreaGetResponseDto,
      typeof (careArea as any).toObject === 'function'
        ? (careArea as any).toObject()
        : careArea,
    );
  }

  mapWithServiceChecklist(
    careArea: CareAreaDoc | ICareAreaEntity,
    serviceChecklists: any[],
  ): CareAreaWithServiceChecklistResponseDto {
    const careAreaData =
      typeof (careArea as any).toObject === 'function'
        ? (careArea as any).toObject()
        : careArea;

    return plainToInstance(CareAreaWithServiceChecklistResponseDto, {
      ...careAreaData,
      serviceChecklists:
        this.serviceChecklistService.mapList(serviceChecklists),
    });
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareAreaDoc[]> {
    return this.careAreaRepository.findAll<CareAreaDoc>(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc | null> {
    return this.careAreaRepository.findOneById<CareAreaDoc>(_id, options);
  }
  async join(repository: CareAreaDoc): Promise<CareAreaDoc> {
    return this.careAreaRepository.join(
      repository,
      this.careAreaRepository._join!,
    );
  }
  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc | null> {
    return this.careAreaRepository.findOne<CareAreaDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.careAreaRepository.getTotal(find, options);
  }

  async findAllWithServiceChecklists(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
    vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<CareAreaWithServiceChecklistResponseDto[]> {
    const careAreas = await this.findAll(find, options);

    const result: CareAreaWithServiceChecklistResponseDto[] = [];

    for (const careArea of careAreas) {
      const serviceChecklistFind: Record<string, any> = {
        careArea: careArea._id,
      };

      // Filter by vehicle type if provided
      if (vehicleType) {
        serviceChecklistFind.vehicleType = { $in: [vehicleType] };
      }

      const serviceChecklists = await this.serviceChecklistService.findAll(
        serviceChecklistFind,
        { order: { order: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC } },
      );

      const mapped = this.mapWithServiceChecklist(careArea, serviceChecklists);
      result.push(mapped);
    }

    return result;
  }

  async create(
    { name, description, order }: CareAreaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareAreaDoc> {
    const create: CareAreaEntity = new CareAreaEntity();
    create.name = name;
    create.description = description;
    create.order = order;

    return this.careAreaRepository.create<CareAreaEntity>(create, options);
  }

  async update(
    repository: CareAreaDoc,
    { name, description, order }: CareAreaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareAreaDoc> {
    repository.name = name ?? repository.name;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    return this.careAreaRepository.save(repository, options);
  }

  async softDelete(
    repository: CareAreaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareAreaDoc> {
    return this.careAreaRepository.softDelete(repository, options);
  }

  async delete(
    repository: CareAreaDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<CareAreaDoc> {
    return this.careAreaRepository.delete({ _id: repository._id }, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careAreaRepository.deleteMany(find, options);
    return true;
  }

  async createMany(
    data: CareAreaCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean> {
    const create = data.map((item) => {
      const doc: any = {
        name: item.name,
        description: item.description,
        order: item.order,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        __v: 0,
      };

      // If _id is provided, use it (for seeding with predefined IDs)
      if ('_id' in item && (item as any)._id) {
        doc._id = (item as any)._id;
      }

      return doc;
    });

    // Use insertMany directly to bypass entity creation and UUID generation
    await this.careAreaRepository['_repository'].insertMany(create, {
      ordered: false,
    });

    return true;
  }
}
