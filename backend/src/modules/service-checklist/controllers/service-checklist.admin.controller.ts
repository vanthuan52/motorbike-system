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
import { ServiceChecklistService } from '../services/service-checklist.service';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistGetResponseDto } from '../dtos/response/service-checklist.get.response.dto';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  ServiceChecklistAdminCreateDoc,
  ServiceChecklistAdminDeleteDoc,
  ServiceChecklistAdminListDoc,
  ServiceChecklistAdminParamsIdDoc,
  ServiceChecklistAdminUpdateDoc,
} from '../docs/service-checklist.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR } from '../enums/service-checklist.status-code.enum';
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
  SERVICE_CHECKLIST_DEFAULT_AREA,
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/service-checklist.list.constant';
import { ENUM_SERVICE_CHECKLIST_AREA } from '../enums/service-checklist.enum';

@ApiTags('modules.admin.service-checklist')
@Controller({
  version: '1',
  path: '/service-checklist',
})
export class ServiceChecklistAdminController {
  constructor(
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServiceChecklistAdminListDoc()
  @ResponsePaging('service-checklist.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'area',
      SERVICE_CHECKLIST_DEFAULT_AREA,
      ENUM_SERVICE_CHECKLIST_AREA,
    )
    area: Record<string, any>,
  ): Promise<IResponsePaging<ServiceChecklistListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...area,
    };

    const serviceChecklists = await this.serviceChecklistService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.serviceChecklistService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.serviceChecklistService.mapList(serviceChecklists);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @ServiceChecklistAdminParamsIdDoc()
  @Response('service-checklist.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string,
  ): Promise<IResponse<ServiceChecklistGetResponseDto>> {
    const ServiceChecklist = await this.serviceChecklistService.findOneById(id);
    if (!ServiceChecklist) {
      throw new NotFoundException({
        message: 'service-checklist.error.notFound',
      });
    }
    const mapped = this.serviceChecklistService.mapGet(ServiceChecklist);
    return { data: mapped };
  }

  @ServiceChecklistAdminCreateDoc()
  @Response('service-checklist.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: ServiceChecklistCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const created = await this.serviceChecklistService.create(body);
      return { data: created };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'service-checklist.error.createFailed',
        _error: err,
      });
    }
  }

  @ServiceChecklistAdminUpdateDoc()
  @Response('service-checklist.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: ServiceChecklistUpdateRequestDto,
  ): Promise<void> {
    const serviceChecklist = await this.serviceChecklistService.findOneById(id);

    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.notFound',
      });
    }

    try {
      await this.serviceChecklistService.update(serviceChecklist, body);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'service-checklist.error.updateFailed',
        _error: err,
      });
    }
  }

  @ServiceChecklistAdminDeleteDoc()
  @Response('service-checklist.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
    const serviceChecklist = await this.serviceChecklistService.findOneById(id);
    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.notFound',
      });
    }
    try {
      await this.serviceChecklistService.delete(serviceChecklist);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'service-checklist.error.deleteFailed',
        _error: err,
      });
    }
  }
}
