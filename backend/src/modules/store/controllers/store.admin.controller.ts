import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_STORE_STATUS } from '../enums/store.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { StoreListResponseDto } from '../dtos/response/store.list.response.dto';
import { StoreDoc } from '../entities/store.entity';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { StoreService } from '../services/store.services';
import { StoreGetResponseDto } from '../dtos/response/store.get.response.dto';
import { Response } from '@/common/response/decorators/response.decorator';
import { StoreCreateRequestDto } from '../dtos/request/store.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { StoreUpdateRequestDto } from '../dtos/request/store.update.request.dto';
import { StoreUpdateStatusRequestDto } from '../dtos/request/store.update-status.request.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import {
  StoreAdminCreateDoc,
  StoreAdminDeleteDoc,
  StoreAdminListDoc,
  StoreAdminParamsIdDoc,
  StoreAdminUpdateDoc,
  StoreAdminUpdateStatusDoc,
} from '../docs/store.admin.doc';
import { ENUM_STORE_STATUS_CODE_ERROR } from '../enums/store.status-code.enum';

@ApiTags('modules.admin.store')
@Controller({
  version: '1',
  path: '/store',
})
export class StoreAdminController {
  constructor(
    private readonly storeService: StoreService,
    private readonly paginationService: PaginationService,
  ) {}

  @StoreAdminListDoc()
  @ResponsePaging('store.list')
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
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      [ENUM_STORE_STATUS.ACTIVE, ENUM_STORE_STATUS.INACTIVE],
      ENUM_STORE_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<StoreListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const store: StoreDoc[] = await this.storeService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.storeService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.storeService.mapList(store);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @StoreAdminParamsIdDoc()
  @Response('store.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(@Param('id') id: string): Promise<IResponse<StoreGetResponseDto>> {
    const store = await this.storeService.findOneById(id);
    if (!store) {
      throw new NotFoundException(`store.error.notFound`);
    }
    const mapped = this.storeService.mapGet(store);
    return {
      data: mapped,
    };
  }

  @StoreAdminCreateDoc()
  @Response('store.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.CREATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: StoreCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const existingStoreBySlug = await this.storeService.findOne({
        slug: body.slug,
      });
      if (existingStoreBySlug) {
        throw new ConflictException({
          statusCode: ENUM_STORE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'store.error.slugExisted',
        });
      }

      const store = await this.storeService.create(body);
      return {
        data: store,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        message: 'store.error.createFailed',
        error: error,
      });
    }
  }

  @StoreAdminUpdateDoc()
  @Response('store.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: StoreUpdateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const store = await this.storeService.findOneById(id);
    if (!store) {
      throw new NotFoundException('store.error.notFoundStore');
    }
    if (body.slug && body.slug !== store.slug) {
      const existingBySlug = await this.storeService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== store._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_STORE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'store.error.slugExisted',
        });
      }
    }
    try {
      const storeUpdated = await this.storeService.update(store, body);
      return { data: storeUpdated };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException({
        message: 'store.error.updateFailed',
        error: error,
      });
    }
  }

  @StoreAdminDeleteDoc()
  @Response('store.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.DELETE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
    const store = await this.storeService.findOneById(id);
    if (!store) {
      throw new NotFoundException('store.error.notFound');
    }
    try {
      await this.storeService.softDelete(store);
      return {};
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'store.error.deleteFailed',
        error: error,
      });
    }
  }

  @StoreAdminUpdateStatusDoc()
  @Response('store.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.UPDATE],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: StoreUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    const store = await this.storeService.findOneById(id);
    if (!store) {
      throw new NotFoundException('store.error.notFound');
    }
    try {
      await this.storeService.updateStatus(
        store,
        { status: body.status },
        {} as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: body.status.toLowerCase(),
            },
          },
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'store.error.updateStatusFailed',
        error: error,
      });
    }
  }
}
