import {
  Injectable,
  NotFoundException,
  ConflictException,
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
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumVehicleServiceStatusCodeError } from '../enums/vehicle-service.status-code.enum';
import { VehicleService, Prisma } from '@/generated/prisma-client';

@Injectable()
export class VehicleServiceService implements IVehicleServiceService {
  private readonly uploadPath: string;

  constructor(
    private readonly vehicleServiceRepository: VehicleServiceRepository,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly vehicleServiceUtil: VehicleServiceUtil,
  ) {
    this.uploadPath =
      this.configService.get<string>('vehicleService.uploadPath') || '';
  }

  async findAll(find?: Prisma.VehicleServiceWhereInput): Promise<VehicleService[]> {
    return this.vehicleServiceRepository.findAll({ where: find } as any);
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleService[]; total: number }> {
    const { data, count } =
      await this.vehicleServiceRepository.findWithPaginationOffset(
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
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleService[]; total?: number }> {
    const { data, count } =
      await this.vehicleServiceRepository.findWithPaginationCursor(
        pagination,
        filters,
      );

    return { data, total: count };
  }

  async findOneById(id: string): Promise<VehicleService> {
    const vehicleService = await this.findOneByIdOrFail(id);
    return vehicleService;
  }

  async findOneWithServiceCategoryById(id: string): Promise<VehicleService | null> {
    return this.vehicleServiceRepository.findOneById(id);
  }

  async findOne(find: Prisma.VehicleServiceWhereInput): Promise<VehicleService> {
    const vehicleService = await this.vehicleServiceRepository.findOne(find);
    if (!vehicleService) {
      return null as any;
    }
    return vehicleService;
  }

  async getTotal(find?: Prisma.VehicleServiceWhereInput): Promise<number> {
    return this.vehicleServiceRepository.getTotal({ where: find } as any);
  }

  async create(payload: VehicleServiceCreateRequestDto): Promise<VehicleService> {
    // Check slug conflict
    const existingSlug = await this.vehicleServiceRepository.findOneBySlug(
      payload.slug,
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
        orderBy: payload.orderBy ? parseInt(payload.orderBy, 10) : 0,
        status: payload.status ? payload.status : EnumVehicleServiceStatus.active,
        serviceCategory: {
          connect: { id: payload.serviceCategory }
        },
        checklistItems: {
          connect: payload.checklistItems.map(id => ({ id }))
        }
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

  async update(id: string, payload: VehicleServiceUpdateRequestDto): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    // Check slug conflict if slug is being updated
    if (payload.slug && payload.slug !== repository.slug) {
      const existingSlug = await this.vehicleServiceRepository.findOneBySlug(
        payload.slug,
      );
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException({
          statusCode: EnumVehicleServiceStatusCodeError.slugExisted,
          message: 'vehicle-service.error.slugExisted',
        });
      }
    }

    const updateData: Prisma.VehicleServiceUpdateInput = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.slug !== undefined) updateData.slug = payload.slug.toLowerCase();
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.orderBy !== undefined) updateData.orderBy = parseInt(payload.orderBy, 10);
    
    if (payload.serviceCategory !== undefined) {
      updateData.serviceCategory = {
        connect: { id: payload.serviceCategory }
      };
    }

    if (payload.checklistItems !== undefined) {
      updateData.checklistItems = {
        set: payload.checklistItems.map(itemId => ({ id: itemId })) // 'set' replaces the existing connections
      };
    }

    try {
      await this.vehicleServiceRepository.update(id, updateData);
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
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.vehicleServiceRepository.update(id, { status: payload.status });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.vehicleServiceRepository.update(id, { deletedAt: new Date() } as any);
  }

  async deleteMany(find?: Prisma.VehicleServiceWhereInput): Promise<boolean> {
    await this.vehicleServiceRepository.deleteMany(find || {});
    return true;
  }

  async findBySlug(slug: string): Promise<VehicleService> {
    const vehicleService = await this.vehicleServiceRepository.findOneBySlug(slug);
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: EnumVehicleServiceStatusCodeError.notFound,
        message: 'vehicle-service.error.notFound',
      });
    }
    return vehicleService;
  }

  createRandomFilenamePhoto(
    vehicleService: string,
    { mime }: VehicleServiceUploadPhotoRequestDto,
  ): string {
    let path: string = this.uploadPath.replace('{vehicleService}', vehicleService);
    const randomPath = this.helperService.randomString(10);
    const extension = mime.split('/')[1];

    if (path.startsWith('/')) {
      path = path.replace('/', '');
    }

    return `${path}/${randomPath}.${extension.toLowerCase()}`;
  }

  async updatePhoto(
    repository: VehicleService,
    photo: AwsS3Dto,
  ): Promise<VehicleService> {
    return this.vehicleServiceRepository.update(repository.id, {
      photo: {
        ...photo,
        size: photo.size,
      } as any,
    });
  }

  private async findOneByIdOrFail(id: string): Promise<VehicleService> {
    const vehicleService = await this.vehicleServiceRepository.findOneById(id);
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: EnumVehicleServiceStatusCodeError.notFound,
        message: 'vehicle-service.error.notFound',
      });
    }
    return vehicleService;
  }
}
