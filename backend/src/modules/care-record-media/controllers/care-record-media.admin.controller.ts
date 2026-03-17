import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordMediaService } from '../services/care-record-media.service';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordMediaAdminCreateDoc,
  CareRecordMediaAdminDeleteDoc,
  CareRecordMediaAdminListDoc,
  CareRecordMediaAdminParamsIdDoc,
  CareRecordMediaAdminUpdateDoc,
} from '../docs/care-record-media.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record-media.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { RequestOptionalParseUUIDPipe } from '@/common/request/pipes/request.optional-parse-uuid.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';

import { CareRecordMediaUtil } from '../utils/care-record-media.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.admin.care-record-media')
@Controller({
  version: '1',
  path: '/care-record-media',
})
export class CareRecordMediaAdminController {
  constructor(
    private readonly careRecordMediaService: CareRecordMediaService,
    private readonly careRecordMediaUtil: CareRecordMediaUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @CareRecordMediaAdminListDoc()
  @ResponsePaging('care-record-media.list')
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
      availableSearch: CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePagingReturn<CareRecordMediaListResponseDto>> {
    const filters: Record<string, any> = {};

    if (careRecordId) {
      filters['careRecord._id'] = careRecordId;
    }

    const { data, total } = await this.careRecordMediaService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.careRecordMediaUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareRecordMediaAdminParamsIdDoc()
  @Response('care-record-media.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<CareRecordMediaGetFullResponseDto>> {
    const careRecordMedia = await this.careRecordMediaService.findOneById(id);
    return {
      data: this.careRecordMediaUtil.mapGetFull(careRecordMedia),
    };
  }

  @CareRecordMediaAdminCreateDoc()
  @Response('care-record-media.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareRecordMediaCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordMediaService.create(body);
    return { data: { _id: created._id } };
  }

  @CareRecordMediaAdminUpdateDoc()
  @Response('care-record-media.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: CareRecordMediaUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordMediaService.update(id, body);
    return {};
  }

  @CareRecordMediaAdminDeleteDoc()
  @Response('care-record-media.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordMediaService.delete(id);
    return {};
  }
}
