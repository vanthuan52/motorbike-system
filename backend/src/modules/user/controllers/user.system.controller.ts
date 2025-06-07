import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { ApiKeySystemProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterIn,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_STATUS,
} from '../constants/user.list.contant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_USER_STATUS } from '../enums/user.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { UserShortResponseDto } from '../dtos/response/user.short.response.dto';
import { IUserEntity } from '../interfaces/user.interface';
import { UserCheckEmailRequestDto } from '../dtos/request/user.check.request.dto';
import { UserCheckResponseDto } from '../dtos/response/user.check.response.dto';
import {
  UserSystemCheckEmailDoc,
  UserSystemListDoc,
} from '../docs/user.system.doc';

@ApiTags('modules.system.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserSystemController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  @UserSystemListDoc()
  @ResponsePaging('user.list')
  @ApiKeySystemProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: USER_DEFAULT_AVAILABLE_SEARCH,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      USER_DEFAULT_STATUS,
      ENUM_USER_STATUS,
    )
    status: Record<string, any>,
    @PaginationQueryFilterIn('role') role: Record<string, any>,
  ): Promise<IResponsePaging<UserShortResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...role,
      ...status,
    };

    const users: IUserEntity[] = await this.userService.findAllWithRole(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.userService.getTotalWithRole(find);

    const totalPage: number = await this.paginationService.totalPage(
      total,
      _limit,
    );

    const mapUsers: UserShortResponseDto[] = this.userService.mapShort(users);

    return {
      _pagination: { total, totalPage },
      data: mapUsers,
    };
  }

  @UserSystemCheckEmailDoc()
  @Response('user.checkEmail')
  @ApiKeySystemProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/check/email')
  async checkEmail(
    @Body() { email }: UserCheckEmailRequestDto,
  ): Promise<IResponse<UserCheckResponseDto>> {
    const user = await this.userService.findOneByEmail(email);
    const mapped = user ? this.userService.mapCensor(user) : undefined;

    return {
      data: { exist: !!user, user: mapped },
    };
  }
}
