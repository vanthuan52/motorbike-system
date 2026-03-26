import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { HiringUpdateStatusRequestDto } from '../dtos/request/hiring.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import {
  HiringAdminCreateDoc,
  HiringAdminDeleteDoc,
  HiringAdminListDoc,
  HiringAdminParamsIdDoc,
  HiringAdminUpdateDoc,
  HiringAdminUpdateStatusDoc,
} from '../docs/hiring.admin.doc';
import { HiringService } from '../services/hiring.service';
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumHiringStatus } from '../enums/hiring.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { EnumHiringStatusCodeError } from '../enums/hiring.status-code.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { HiringUtil } from '../utils/hiring.util';
import { HiringResponseDto } from '../dtos/hiring-response.dto';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringAdminController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly hiringUtil: HiringUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @HiringAdminListDoc()
  @ResponsePaging('hiring.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ['title', 'status'],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    @PaginationQueryFilterInEnum('status', [
      EnumHiringStatus.published,
      EnumHiringStatus.draft,
      EnumHiringStatus.archived,
    ])
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<HiringResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
    };

    const result = await this.hiringService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.hiringUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @HiringAdminParamsIdDoc()
  @Response('hiring.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string
  ): Promise<IResponseReturn<HiringResponseDto>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException('hiring.error.notFoundHiring');
    }
    const mapped = this.hiringUtil.mapOne(hiring);
    return { data: mapped };
  }

  @HiringAdminCreateDoc()
  @Response('hiring.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: HiringCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    try {
      const existingHiringBySlug = await this.hiringService.findOne({
        slug: body.slug,
      });
      if (existingHiringBySlug) {
        throw new ConflictException({
          statusCode: EnumHiringStatusCodeError.slugExisted,
          message: 'hiring.error.slugExisted',
        });
      }
      const hiring = await this.hiringService.create(body);
      return { data: { id: hiring.id } };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'hiring.error.createFailed',
        _error: err,
      });
    }
  }

  @HiringAdminUpdateDoc()
  @Response('hiring.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: HiringUpdateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException('hiring.error.notFoundHiring');
    }

    if (body.slug && body.slug !== hiring.slug) {
      const existingBySlug = await this.hiringService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== hiring._id.toString()
      ) {
        throw new ConflictException({
          statusCode: EnumHiringStatusCodeError.slugExisted,
          message: 'hiring.error.slugExisted',
        });
      }
    }
    try {
      await this.hiringService.update(hiring.id, body);
      return { data: { id: hiring.id } };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'hiring.error.updateFailed',
        _error: err,
      });
    }
  }

  @HiringAdminDeleteDoc()
  @Response('hiring.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponseReturn<void>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException('hiring.error.notFoundHiring');
    }
    try {
      await this.hiringService.delete(hiring.id);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'hiring.error.deleteFailed',
        _error: err,
      });
    }
  }

  @HiringAdminUpdateStatusDoc()
  @Response('hiring.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin, EnumRoleType.user)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: HiringUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException('hiring.error.notFoundHiring');
    }
    try {
      await this.hiringService.updateStatus(
        hiring.id,
        { status }
      );
      return {
        metadata: {
          messageProperties: {
            status: status.toLowerCase(),
          },
        },
      };
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'hiring.error.updateStatusFailed',
        _error: err,
      });
    }
  }
}
