import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PasswordHistoryAdminListDoc } from '../docs/password-history.admin.doc';
import { PasswordHistoryResponseDto } from '../dtos/response/password-history.response.dto';
import { PasswordHistoryService } from '../services/password-history.service';
import { PasswordHistoryUtil } from '../utils/password-history.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.user.passwordHistory')
@Controller({
  version: '1',
  path: '/user/:userId/password-history',
})
export class PasswordHistoryAdminController {
  constructor(
    private readonly passwordHistoryService: PasswordHistoryService,
    private readonly passwordHistoryUtil: PasswordHistoryUtil
  ) {}

  @PasswordHistoryAdminListDoc()
  @ResponsePaging('passwordHistory.list')
  @PolicyAbilityProtected(
    {
      subject: EnumPolicySubject.user,
      action: [EnumPolicyAction.read],
    },
    {
      subject: EnumPolicySubject.passwordHistory,
      action: [EnumPolicyAction.read],
    }
  )
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery()
    pagination: IPaginationQueryOffsetParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >,
    @Param('userId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    userId: string
  ): Promise<IResponsePagingReturn<PasswordHistoryResponseDto>> {
    const result = await this.passwordHistoryService.getListOffsetByAdmin(
      userId,
      pagination
    );

    const mapped = this.passwordHistoryUtil.mapList(result.data as any);

    return {
      ...result,
      data: mapped,
    };
  }
}
