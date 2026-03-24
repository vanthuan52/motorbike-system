import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { EnumPermissionStatusCodeError } from '@/modules/permission/enums/permission.status-code.enum';
import { IPermissionService } from '@/modules/permission/interfaces/permission.service.interface';
import { PermissionRepository } from '@/modules/permission/repositories/permission.repository';
import { PermissionUtil } from '@/modules/permission/utils/permission.util';
import { EnumPermissionType, Prisma } from '@/generated/prisma-client';

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
  ): Promise<IResponsePagingReturn<PermissionListResponseDto>> {
    const { data, ...others } =
      await this.PermissionRepository.findWithPaginationOffsetByAdmin(
        pagination,
        type
      );

    const Permissions: PermissionListResponseDto[] =
      this.PermissionUtil.mapList(data);

    return {
      data: Permissions,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<PermissionListResponseDto>> {
    const { data, ...others } =
      await this.PermissionRepository.findWithPaginationCursor(
        pagination,
        type
      );

    const Permissions: PermissionListResponseDto[] =
      this.PermissionUtil.mapList(data);

    return {
      data: Permissions,
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

  async createByAdmin({
    name,
    ...others
  }: PermissionCreateRequestDto): Promise<IResponseReturn<PermissionDto>> {
    const exist = await this.PermissionRepository.existByName(name);
    if (exist) {
      throw new ConflictException({
        statusCode: EnumPermissionStatusCodeError.exist,
        message: 'Permission.error.exist',
      });
    }

    const created = await this.PermissionRepository.create({ name, ...others });
    return {
      data: this.PermissionUtil.mapOne(created),
      metadataActivityLog: this.PermissionUtil.mapActivityLogMetadata(created),
    };
  }

  async updateByAdmin(
    id: string,
    data: PermissionUpdateRequestDto
  ): Promise<IResponseReturn<PermissionDto>> {
    const Permission = await this.PermissionRepository.existById(id);
    if (!Permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'Permission.error.notFound',
      });
    }

    const updated = await this.PermissionRepository.update(id, data);
    return {
      data: this.PermissionUtil.mapOne(updated),
      metadataActivityLog: this.PermissionUtil.mapActivityLogMetadata(updated),
    };
  }

  async deleteByAdmin(id: string): Promise<IResponseReturn<void>> {
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

    const deleted = await this.PermissionRepository.delete(id);

    return {
      metadataActivityLog: this.PermissionUtil.mapActivityLogMetadata(deleted),
    };
  }
}
