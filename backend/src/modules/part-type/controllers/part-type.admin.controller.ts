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
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartTypeService } from '../services/part-type.services';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';
import { IDatabaseSaveOptions } from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { ENUM_PART_TYPE_STATUS } from '../enums/part-type.enum';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPartTypeDoc,
  IPartTypeEntity,
} from '../interfaces/part-type.interface';
import {
  PartTypeAdminCreateDoc,
  PartTypeAdminDeleteDoc,
  PartTypeAdminListDoc,
  PartTypeAdminParamsIdDoc,
  PartTypeAdminUpdateDoc,
  PartTypeAdminUpdateStatusDoc,
} from '../docs/part-type.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_PART_TYPE_STATUS_CODE_ERROR } from '../enums/part-type.status-code.enum';
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
import { PartTypeDoc } from '../entities/part-type.entity';

@ApiTags('modules.admin.part-type')
@Controller({
  version: '1',
  path: '/part-type',
})
export class PartTypeAdminController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly paginationService: PaginationService,
  ) {}

  @PartTypeAdminListDoc()
  @ResponsePaging('part-type.list')
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
      [ENUM_PART_TYPE_STATUS.ACTIVE, ENUM_PART_TYPE_STATUS.INACTIVE],
      ENUM_PART_TYPE_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<PartTypeListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const partTypes = await this.partTypeService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.partTypeService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.partTypeService.mapList(partTypes);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @PartTypeAdminParamsIdDoc()
  @Response('part-type.get')
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
  ): Promise<IResponse<PartTypeGetResponseDto>> {
    const partType = await this.partTypeService.findOneById(id);
    if (!partType) {
      throw new NotFoundException({
        message: 'part-type.error.notFound',
      });
    }
    const mapped = this.partTypeService.mapGet(partType);
    return { data: mapped };
  }

  @PartTypeAdminCreateDoc()
  @Response('part-type.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: PartTypeCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    try {
      const existingPartType = await this.partTypeService.findBySlug(body.slug);
      if (existingPartType) {
        throw new InternalServerErrorException({
          statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'part-type.error.slugExisted',
        });
      }

      const created = await this.partTypeService.create(body);
      return { data: created };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException({
        message: 'part-type.error.createFailed',
        _error: err,
      });
    }
  }

  @PartTypeAdminUpdateDoc()
  @Response('part-type.update')
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
    @Body() body: PartTypeUpdateRequestDto,
  ): Promise<void> {
    const partType = await this.partTypeService.findOneById(id);

    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part-type.error.notFound',
      });
    }

    if (body.slug && body.slug !== partType.slug) {
      const existingBySlug = await this.partTypeService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== partType._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'part-type.error.slugExisted',
        });
      }
    }
    try {
      await this.partTypeService.update(partType, body);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'part-type.error.updateFailed',
        _error: err,
      });
    }
  }

  @PartTypeAdminUpdateStatusDoc()
  @Response('part-type.updateStatus')
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
    @Body() { status }: PartTypeUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    const partType = await this.partTypeService.findOneById(id);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part-type.error.notFound',
      });
    }
    try {
      await this.partTypeService.updateStatus(
        partType,
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
        message: 'part-type.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @PartTypeAdminDeleteDoc()
  @Response('part-type.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<IResponse<void>> {
    const partType = await this.partTypeService.findOneById(id);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part-type.error.notFound',
      });
    }
    try {
      await this.partTypeService.softDelete(partType);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'part-type.error.deleteFailed',
        _error: err,
      });
    }
  }
}
