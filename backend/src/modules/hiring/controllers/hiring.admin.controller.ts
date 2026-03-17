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
import { HiringDoc } from '../entities/hiring.entity';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  HiringAdminCreateDoc,
  HiringAdminDeleteDoc,
  HiringAdminListDoc,
  HiringAdminParamsIdDoc,
  HiringAdminUpdateDoc,
  HiringAdminUpdateStatusDoc,
} from '../docs/hiring.admin.doc';
import { HiringService } from '../services/hiring.service';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
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
import { ENUM_HIRING_STATUS } from '../enums/hiring.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import { ENUM_HIRING_STATUS_CODE_ERROR } from '../enums/hiring.status-code.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { HiringUtil } from '../utils/hiring.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { HiringResponseDto } from '../dtos/hiring-response.dto';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringAdminController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly paginationService: PaginationService,
    private readonly hiringUtil: HiringUtil,
    private readonly paginationUtil: PaginationUtil,
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
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', [
      ENUM_HIRING_STATUS.PUBLISHED,
      ENUM_HIRING_STATUS.DRAFT,
      ENUM_HIRING_STATUS.ARCHIVED,
    ])
    status: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<HiringResponseDto>> {
    const find: Record<string, any> = {
      ...where,
      ...status,
    };

    const [hiring, total] = await Promise.all([
      this.hiringService.findAll(find, {
        paging: {
          limit,
          offset: skip,
        },
        order: orderBy,
      }),
      this.hiringService.getTotal(find),
    ]);

    const mapped = this.hiringUtil.mapList(hiring);

    return this.paginationUtil.formatOffset(mapped, total, {
      limit,
      skip,
    });
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
    @Param('id') id: string,
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
    @Body() body: HiringCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    try {
      const existingHiringBySlug = await this.hiringService.findOne({
        slug: body.slug,
      });
      if (existingHiringBySlug) {
        throw new ConflictException({
          statusCode: ENUM_HIRING_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'hiring.error.slugExisted',
        });
      }
      const hiring = await this.hiringService.create(body);
      return { data: { _id: hiring._id } };
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
    @Body() body: HiringUpdateRequestDto,
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
          statusCode: ENUM_HIRING_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'hiring.error.slugExisted',
        });
      }
    }
    try {
      const hiringUpdated = await this.hiringService.update(hiring, body);
      return { data: { _id: hiringUpdated._id } };
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
      await this.hiringService.softDelete(hiring);
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
    @Body() { status }: HiringUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException('hiring.error.notFoundHiring');
    }
    try {
      await this.hiringService.updateStatus(
        hiring,
        { status },
        {} as IDatabaseSaveOptions,
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
