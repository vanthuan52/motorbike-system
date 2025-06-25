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
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { HiringListResponseDto } from '../dtos/response/hiring.list.response.dto';
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
import { HiringService } from '../services/hiring.services';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { ENUM_HIRING_STATUS } from '../enums/hiring.enum';
import { HiringGetResponseDto } from '../dtos/response/hiring.get.response.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import { ENUM_HIRING_STATUS_CODE_ERROR } from '../enums/hiring.status-code.enum';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringAdminController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly paginationService: PaginationService,
  ) {}

  @HiringAdminListDoc()
  @ResponsePaging('hiring.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: ['title', 'status'],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [
        ENUM_HIRING_STATUS.PUBLISHED,
        ENUM_HIRING_STATUS.DRAFT,
        ENUM_HIRING_STATUS.ARCHIVED,
      ],
      ENUM_HIRING_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<HiringListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const hiring: HiringDoc[] = await this.hiringService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.hiringService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.hiringService.mapList(hiring);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @HiringAdminParamsIdDoc()
  @Response('hiring.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(@Param('id') id: string): Promise<IResponse<HiringGetResponseDto>> {
    const hiring = await this.hiringService.findOneById(id);
    if (!hiring) {
      throw new NotFoundException('hiring.error.notFoundHiring');
    }
    const mapped = this.hiringService.mapGet(hiring);
    return { data: mapped };
  }

  @HiringAdminCreateDoc()
  @Response('hiring.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.CREATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: HiringCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
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
      return { data: hiring };
    } catch (err) {
      // console.log(err);

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
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: HiringUpdateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
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
      return { data: hiringUpdated };
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
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.DELETE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
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
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: HiringUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
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
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
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
