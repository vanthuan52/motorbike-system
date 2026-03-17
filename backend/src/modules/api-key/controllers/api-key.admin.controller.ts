import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiKeyService } from '../services/api-key.service';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { ApiKeyProtected } from '../decorators/api-key.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterEqualBoolean,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
  IPaginationEqual,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  ApiKeyDefaultAvailableSearch,
  ApiKeyDefaultType,
} from '../constants/api-key.list.constant';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { ApiKeyDto } from '../dtos/api-key.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ApiKeyCreateRequestDto } from '../dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateRequestDto } from '../dtos/request/api-key.update.request.dto';
import { ApiKeyUpdateDateRequestDto } from '../dtos/request/api-key.update-date.request.dto';
import {
  ApiKeyAdminCreateDoc,
  ApiKeyAdminDeleteDoc,
  ApiKeyAdminListDoc,
  ApiKeyAdminResetDoc,
  ApiKeyAdminUpdateDateDoc,
  ApiKeyAdminUpdateDoc,
} from '../docs/api-key.admin.doc';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { ApiKeyCreateResponseDto } from '../dtos/response/api-key.create.response.dto';
import { ApiKeyUpdateStatusRequestDto } from '../dtos/request/api-key.update-status.request.dto';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';

@ApiTags('modules.admin.apiKey')
@Controller({
  version: '1',
  path: '/api-key',
})
export class ApiKeyAdminController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiKeyAdminListDoc()
  @ResponsePaging('apiKey.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ApiKeyDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterEqualBoolean('isActive')
    isActive: Record<string, IPaginationEqual>,
    @PaginationQueryFilterInEnum('type', ApiKeyDefaultType)
    type: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<ApiKeyDto>> {
    return this.apiKeyService.getListOffset(pagination, {
      ...isActive,
      ...type,
    });
  }

  @ApiKeyAdminCreateDoc()
  @Response('apiKey.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/create')
  async create(
    @Body() body: ApiKeyCreateRequestDto,
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>> {
    return this.apiKeyService.create(body);
  }

  @ApiKeyAdminResetDoc()
  @Response('apiKey.reset')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Patch('/update/:apiKeyId/reset')
  async reset(
    @Param('apiKeyId', RequestRequiredPipe) apiKeyId: string,
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>> {
    return this.apiKeyService.reset(apiKeyId);
  }

  @ApiKeyAdminUpdateDoc()
  @Response('apiKey.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:apiKeyId')
  async update(
    @Body() body: ApiKeyUpdateRequestDto,
    @Param('apiKeyId', RequestRequiredPipe) apiKeyId: string,
  ): Promise<IResponseReturn<void>> {
    await this.apiKeyService.update(apiKeyId, body);
    return {};
  }

  @ApiKeyAdminUpdateDateDoc()
  @Response('apiKey.updateDate')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:apiKeyId/date')
  async updateDate(
    @Body() body: ApiKeyUpdateDateRequestDto,
    @Param('apiKeyId', RequestRequiredPipe) apiKeyId: string,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    return this.apiKeyService.updateDate(apiKeyId, body);
  }

  @ApiKeyAdminUpdateDateDoc()
  @Response('apiKey.updateDate')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:apiKeyId/status')
  async updateStatus(
    @Body() body: ApiKeyUpdateStatusRequestDto,
    @Param('apiKeyId', RequestRequiredPipe, RequestIsValidUuidPipe)
    apiKeyId: string,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    return this.apiKeyService.updateStatus(apiKeyId, body);
  }

  @ApiKeyAdminDeleteDoc()
  @Response('apiKey.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read, EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/delete/:apiKeyId')
  async delete(
    @Param('apiKeyId', RequestRequiredPipe) apiKeyId: string,
  ): Promise<IResponseReturn<ApiKeyDto>> {
    return this.apiKeyService.delete(apiKeyId);
  }
}
