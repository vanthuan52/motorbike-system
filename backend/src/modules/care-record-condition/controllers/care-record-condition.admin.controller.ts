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
import { CareRecordConditionService } from '../services/care-record-condition.service';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordConditionDto } from '../dtos/care-record-condition.dto';
import {
  CareRecordConditionAdminParamsIdDoc,
  CareRecordConditionAdminCreateDoc,
  CareRecordConditionAdminUpdateDoc,
  CareRecordConditionAdminDeleteDoc,
} from '../docs/care-record-condition.admin.doc';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { CareRecordConditionUtil } from '../utils/care-record-condition.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

@ApiTags('modules.admin.care-record-condition')
@Controller({
  version: '1',
  path: '/care-record-condition',
})
export class CareRecordConditionAdminController {
  constructor(
    private readonly careRecordConditionService: CareRecordConditionService,
    private readonly careRecordConditionUtil: CareRecordConditionUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @ResponsePaging('care-record-condition.list')
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
      availableSearch: [],
      availableOrderBy: ['createdAt', 'updatedAt'],
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string,
  ): Promise<IResponsePagingReturn<CareRecordConditionDto>> {
    const filters: Record<string, any> = {};

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result = await this.careRecordConditionService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.careRecordConditionUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordConditionAdminParamsIdDoc()
  @Response('care-record-condition.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
  ): Promise<IResponseReturn<CareRecordConditionDto>> {
    const careRecordCondition =
      await this.careRecordConditionService.findOneById(id);
    return {
      data: this.careRecordConditionUtil.mapGet(careRecordCondition),
    };
  }

  @CareRecordConditionAdminCreateDoc()
  @Response('care-record-condition.create')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareRecordConditionCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordConditionService.create(body);
    return { data: { id: created.id } };
  }

  @CareRecordConditionAdminUpdateDoc()
  @Response('care-record-condition.update')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordConditionUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordConditionService.update(id, body);
    return {};
  }

  @CareRecordConditionAdminDeleteDoc()
  @Response('care-record-condition.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
  ): Promise<IResponseReturn<void>> {
    await this.careRecordConditionService.delete(id);
    return {};
  }
}
