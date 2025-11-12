import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareAreaService } from '../services/care-area.service';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { CareAreaGetResponseDto } from '../dtos/response/care-area.get.response.dto';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareAreaAdminCreateDoc,
  CareAreaAdminDeleteDoc,
  CareAreaAdminListDoc,
  CareAreaAdminParamsIdDoc,
  CareAreaAdminUpdateDoc,
} from '../docs/care-area.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_CARE_AREA_STATUS_CODE_ERROR } from '../enums/care-area.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-area.list.constant';

@ApiTags('modules.admin.care-area')
@Controller({
  version: '1',
  path: '/care-area',
})
export class CareAreaAdminController {
  constructor(
    private readonly careAreaService: CareAreaService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareAreaAdminListDoc()
  @ResponsePaging('care-area.list')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: CARE_AREA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_AREA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging<CareAreaListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    const careAreas = await this.careAreaService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.careAreaService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.careAreaService.mapList(careAreas);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareAreaAdminParamsIdDoc()
  @Response('care-area.get')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string,
  ): Promise<IResponse<CareAreaGetResponseDto>> {
    const careArea = await this.careAreaService.findOneById(id);
    if (!careArea) {
      throw new NotFoundException({
        message: 'care-area.error.notFound',
      });
    }
    const mapped = this.careAreaService.mapGet(careArea);
    return { data: mapped };
  }

  @CareAreaAdminCreateDoc()
  @Response('care-area.create')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareAreaCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const created = await this.careAreaService.create(body);
      return { data: created };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'care-area.error.createFailed',
        _error: err,
      });
    }
  }

  @CareAreaAdminUpdateDoc()
  @Response('care-area.update')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: CareAreaUpdateRequestDto,
  ): Promise<void> {
    const careArea = await this.careAreaService.findOneById(id);

    if (!careArea) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_AREA_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-area.error.notFound',
      });
    }

    try {
      await this.careAreaService.update(careArea, body);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-area.error.updateFailed',
        _error: err,
      });
    }
  }

  @CareAreaAdminDeleteDoc()
  @Response('care-area.delete')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
    const CareArea = await this.careAreaService.findOneById(id);
    if (!CareArea) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_AREA_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-area.error.notFound',
      });
    }
    try {
      await this.careAreaService.delete(CareArea);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-area.error.deleteFailed',
        _error: err,
      });
    }
  }
}
