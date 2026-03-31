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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartService } from '../services/part.services';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartDto } from '../dtos/part.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  PartAdminCreateDoc,
  PartAdminDeleteDoc,
  PartAdminListDoc,
  PartAdminParamsIdDoc,
  PartAdminUpdateDoc,
  PartAdminUpdateStatusDoc,
  PartAdminGetDoc,
} from '../docs/part.admin.doc';
import { PartUtil } from '../utils/part.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  PART_DEFAULT_AVAILABLE_ORDER_BY,
  PART_DEFAULT_AVAILABLE_SEARCH,
  PART_DEFAULT_STATUS,
} from '../constants/part.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { AuthJwtPayload } from '@/modules/auth/decorators/auth.jwt.decorator';

@ApiTags('modules.admin.part')
@Controller({
  version: '1',
  path: '/part',
})
export class PartAdminController {
  constructor(
    private readonly partService: PartService,
    private readonly partUtil: PartUtil
  ) {}

  @PartAdminListDoc()
  @ResponsePaging('part.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.part,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: PART_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', PART_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('partType') partTypeId: string,
    @Query('vehicleBrand') vehicleBrandId: string
  ): Promise<IResponsePagingReturn<PartListResponseDto>> {
    const result = await this.partService.getListOffset(
      pagination,
      status,
      partTypeId,
      vehicleBrandId
    );
    const mapped = this.partUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @PartAdminParamsIdDoc()
  @Response('part.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.part,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<PartGetFullResponseDto>> {
    const part = await this.partService.findOneWithRelationsById(id);
    const mapped = this.partUtil.mapGetPopulate(part);
    return { data: mapped };
  }

  @PartAdminCreateDoc()
  @Response('part.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.part,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: PartCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.partService.create(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
    return { data: { id: created.id } };
  }

  @PartAdminUpdateDoc()
  @Response('part.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.part,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: PartUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.partService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @PartAdminUpdateStatusDoc()
  @Response('part.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.part,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: PartUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.partService.updateStatus(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @PartAdminDeleteDoc()
  @Response('part.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.part,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.partService.delete(
      id,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {};
  }
}
