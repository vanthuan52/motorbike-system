import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceCategoryService } from '../services/service-category.services';
import { ServiceCategoryCreateRequestDto } from '../dtos/request/service-category.create.request.dto';
import { ServiceCategoryUpdateRequestDto } from '../dtos/request/service-category.update.request.dto';
import { ServiceCategoryUpdateStatusRequestDto } from '../dtos/request/service-category.update-status.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryGetResponseDto } from '../dtos/response/service-category.get.response.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  ServiceCategoryAdminCreateDoc,
  ServiceCategoryAdminDeleteDoc,
  ServiceCategoryAdminListDoc,
  ServiceCategoryAdminParamsIdDoc,
  ServiceCategoryAdminUpdateDoc,
  ServiceCategoryAdminUpdateStatusDoc,
} from '../docs/service-category.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR } from '../enums/service-category.status-code.enum';
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
import { ServiceCategoryDoc } from '../entities/service-category.entity';

@ApiTags('modules.admin.service-category')
@Controller({
  version: '1',
  path: '/service-category',
})
export class ServiceCategoryAdminController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly paginationService: PaginationService,
  ) {}

  @ServiceCategoryAdminListDoc()
  @ResponsePaging('service-category.list')
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
      availableSearch: ['name', 'status'],
      availableOrderBy: ['order', 'createdAt', 'updatedAt'],
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [
        ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
        ENUM_SERVICE_CATEGORY_STATUS.INACTIVE,
      ],
      ENUM_SERVICE_CATEGORY_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<ServiceCategoryListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const ServiceCategorys = await this.serviceCategoryService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.serviceCategoryService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.serviceCategoryService.mapList(ServiceCategorys);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @ServiceCategoryAdminParamsIdDoc()
  @Response('service-category.get')
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
  ): Promise<IResponse<ServiceCategoryGetResponseDto>> {
    const ServiceCategory = await this.serviceCategoryService.findOneById(id);
    if (!ServiceCategory) {
      throw new NotFoundException({
        message: 'service-category.error.notFound',
      });
    }
    const mapped = this.serviceCategoryService.mapGet(ServiceCategory);
    return { data: mapped };
  }

  @ServiceCategoryAdminCreateDoc()
  @Response('service-category.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: ServiceCategoryCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const existingServiceCategory =
        await this.serviceCategoryService.findBySlug(body.slug);
      if (existingServiceCategory) {
        throw new InternalServerErrorException({
          statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'service-category.error.slugExisted',
        });
      }

      const created = await this.serviceCategoryService.create(body);
      return { data: created };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'service-category.error.createFailed',
        _error: err,
      });
    }
  }

  @ServiceCategoryAdminUpdateDoc()
  @Response('service-category.update')
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
    @Body() body: ServiceCategoryUpdateRequestDto,
  ): Promise<void> {
    const serviceCategory = await this.serviceCategoryService.findOneById(id);

    if (!serviceCategory) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-category.error.notFound',
      });
    }

    if (body.slug && body.slug !== serviceCategory.slug) {
      const existingBySlug = await this.serviceCategoryService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== serviceCategory._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'service-category.error.slugExisted',
        });
      }
    }
    try {
      await this.serviceCategoryService.update(serviceCategory, body);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'service-category.error.updateFailed',
        _error: err,
      });
    }
  }

  @ServiceCategoryAdminUpdateStatusDoc()
  @Response('service-category.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: ServiceCategoryUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    const ServiceCategory = await this.serviceCategoryService.findOneById(id);
    if (!ServiceCategory) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-category.error.notFound',
      });
    }
    try {
      await this.serviceCategoryService.updateStatus(
        ServiceCategory,
        { status },
        {} as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'service-category.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @ServiceCategoryAdminDeleteDoc()
  @Response('service-category.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
    const ServiceCategory = await this.serviceCategoryService.findOneById(id);
    if (!ServiceCategory) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-category.error.notFound',
      });
    }
    try {
      await this.serviceCategoryService.softDelete(ServiceCategory);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'service-category.error.deleteFailed',
        _error: err,
      });
    }
  }
}
