import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaginationCursorQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PasswordHistorySharedListDoc } from '../docs/password-history.shared.doc';
import { PasswordHistoryResponseDto } from '../dtos/response/password-history.response.dto';
import { PasswordHistoryService } from '../services/password-history.service';
import { PasswordHistoryUtil } from '../utils/password-history.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.shared.user.passwordHistory')
@Controller({
  version: '1',
  path: '/user/password-history',
})
export class PasswordHistorySharedController {
  constructor(
    private readonly passwordHistoryService: PasswordHistoryService,
    private readonly passwordHistoryUtil: PasswordHistoryUtil
  ) {}

  @PasswordHistorySharedListDoc()
  @ResponsePaging('passwordHistory.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationCursorQuery()
    pagination: IPaginationQueryCursorParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >,
    @AuthJwtPayload('userId') userId: string
  ): Promise<IResponsePagingReturn<PasswordHistoryResponseDto>> {
    const result = await this.passwordHistoryService.getListCursor(
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
