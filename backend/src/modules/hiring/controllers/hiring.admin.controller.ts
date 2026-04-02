import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  NotFoundException,
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
import { EnumHiringStatus } from '../enums/hiring.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { HiringUtil } from '../utils/hiring.util';
import { HiringResponseDto } from '../dtos/hiring-response.dto';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.hiring')
@Controller({
  version: '1',
  path: '/hiring',
})
export class HiringAdminController {
  constructor(
    private readonly hiringService: HiringService,
    private readonly hiringUtil: HiringUtil
  ) {}

  @HiringAdminListDoc()
  @ResponsePaging('hiring.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.hiring,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
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

    const result = await this.hiringService.getListOffset(pagination, filters);
    const mapped = this.hiringUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @HiringAdminParamsIdDoc()
  @Response('hiring.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.hiring,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin', 'user')
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
    subject: EnumPolicySubject.hiring,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminHiringCreate)
  @Post('/create')
  async create(
    @Body() body: HiringCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.hiringService.create(body);
    return { data: created };
  }

  @HiringAdminUpdateDoc()
  @Response('hiring.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.hiring,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminHiringUpdate)
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: HiringUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.hiringService.update(id, body);
    return {};
  }

  @HiringAdminDeleteDoc()
  @Response('hiring.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.hiring,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminHiringDelete)
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponseReturn<void>> {
    await this.hiringService.delete(id);
    return {};
  }

  @HiringAdminUpdateStatusDoc()
  @Response('hiring.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.hiring,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminHiringUpdateStatus)
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() payload: HiringUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.hiringService.updateStatus(id, payload);
    return {
      metadata: {
        messageProperties: {
          status: payload.status.toLowerCase(),
        },
      },
    };
  }
}
