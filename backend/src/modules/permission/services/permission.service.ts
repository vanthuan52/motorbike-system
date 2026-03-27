import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { EnumPermissionStatusCodeError } from '@/modules/permission/enums/permission.status-code.enum';
import { IPermissionService } from '@/modules/permission/interfaces/permission.service.interface';
import { PermissionRepository } from '@/modules/permission/repositories/permission.repository';
import { PermissionUtil } from '@/modules/permission/utils/permission.util';
import { PermissionModel } from '../models/permission.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(
    private readonly PermissionRepository: PermissionRepository,
    private readonly PermissionUtil: PermissionUtil
  ) {}

  async getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<PermissionModel>> {
    const { data, ...others } =
      await this.PermissionRepository.findWithPaginationOffsetByAdmin(
        pagination,
        type
      );

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<PermissionModel>> {
    const { data, ...others } =
      await this.PermissionRepository.findWithPaginationCursor(
        pagination,
        type
      );

    return {
      data,
      ...others,
    };
  }

  async getOne(id: string): Promise<IResponseReturn<PermissionDto>> {
    const Permission = await this.PermissionRepository.findOneById(id);
    if (!Permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'Permission.error.notFound',
      });
    }

    return { data: this.PermissionUtil.mapOne(Permission) };
  }

  async createByAdmin(
    { name, ...others }: PermissionCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<PermissionDto>> {
    const exist = await this.PermissionRepository.existByName(name);
    if (exist) {
      throw new ConflictException({
        statusCode: EnumPermissionStatusCodeError.exist,
        message: 'Permission.error.exist',
      });
    }

    const created = await this.PermissionRepository.create({
      name,
      ...others,
      createdBy,
    });
    return {
      data: this.PermissionUtil.mapOne(created),
      metadataActivityLog: this.PermissionUtil.mapActivityLogMetadata(created),
    };
  }

  async updateByAdmin(
    id: string,
    data: PermissionUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<PermissionDto>> {
    const Permission = await this.PermissionRepository.existById(id);
    if (!Permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'Permission.error.notFound',
      });
    }

    const updated = await this.PermissionRepository.update(id, {
      ...data,
      updatedBy,
    });
    return {
      data: this.PermissionUtil.mapOne(updated),
      metadataActivityLog: this.PermissionUtil.mapActivityLogMetadata(updated),
    };
  }

  async deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>> {
    const [Permission, PermissionUsed] = await Promise.all([
      this.PermissionRepository.existById(id),
      this.PermissionRepository.used(id),
    ]);

    if (!Permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'Permission.error.notFound',
      });
    } else if (PermissionUsed) {
      throw new ConflictException({
        statusCode: EnumPermissionStatusCodeError.used,
        message: 'Permission.error.used',
      });
    }

    const deleted = await this.PermissionRepository.update(id, {
      deletedAt: new Date(),
      deletedBy,
    });

    return {
      metadataActivityLog: this.PermissionUtil.mapActivityLogMetadata(deleted),
    };
  }
}
