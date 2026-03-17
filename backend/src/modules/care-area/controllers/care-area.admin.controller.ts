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
import { CareAreaService } from '../services/care-area.service';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { CareAreaDto } from '../dtos/care-area.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  CareAreaAdminListDoc,
  CareAreaWithServiceChecklistDoc,
  CareAreaAdminParamsIdDoc,
  CareAreaAdminCreateDoc,
  CareAreaAdminUpdateDoc,
  CareAreaAdminDeleteDoc,
} from '../docs/care-area.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-area.list.constant';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

import { CareAreaUtil } from '../utils/care-area.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { ServiceChecklistUtil } from '@/modules/service-checklist/utils/service-checklist.util';

@ApiTags('modules.admin.care-area')
@Controller({
  version: '1',
  path: '/care-area',
})
export class CareAreaAdminController {
  constructor(
    private readonly careAreaService: CareAreaService,
    private readonly careAreaUtil: CareAreaUtil,
    private readonly paginationUtil: PaginationUtil,
    private readonly serviceChecklistUtil: ServiceChecklistUtil,
  ) {}

  @CareAreaAdminListDoc()
  @ResponsePaging('care-area.list')
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
      availableSearch: CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
  ): Promise<IResponsePagingReturn<CareAreaListResponseDto>> {
    const { data, total } =
      await this.careAreaService.getListOffset(pagination);
    const mapped = this.careAreaUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareAreaAdminParamsIdDoc()
  @Response('care-area.get')
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
  ): Promise<IResponseReturn<CareAreaDto>> {
    const careArea = await this.careAreaService.findOneById(id);
    const mapped = this.careAreaUtil.mapGet(careArea);
    return { data: mapped };
  }

  @CareAreaAdminCreateDoc()
  @Response('care-area.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareAreaCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careAreaService.create(body);
    return { data: { _id: created._id } };
  }

  @CareAreaWithServiceChecklistDoc()
  @ResponsePaging('care-area.listWithServiceChecklists')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/checklists')
  async listWithServiceChecklists(
    @PaginationOffsetQuery({
      availableSearch: CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('vehicleType') vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<IResponsePagingReturn<CareAreaWithServiceChecklistResponseDto>> {
    const { data, total, checklistMap } =
      await this.careAreaService.getListOffsetWithServiceChecklists(
        pagination,
        vehicleType,
      );

    const mapped = data.map((careArea) => {
      const checklists = checklistMap.get(careArea._id.toString()) || [];
      const mappedChecklists = this.serviceChecklistUtil.mapList(checklists);
      return this.careAreaUtil.mapWithServiceChecklists(
        careArea,
        mappedChecklists,
      );
    });

    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @CareAreaAdminUpdateDoc()
  @Response('care-area.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe) id: string,
    @Body() body: CareAreaUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.careAreaService.update(id, body);
    return {};
  }

  @CareAreaAdminDeleteDoc()
  @Response('care-area.delete')
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
    await this.careAreaService.delete(id);
    return {};
  }
}
