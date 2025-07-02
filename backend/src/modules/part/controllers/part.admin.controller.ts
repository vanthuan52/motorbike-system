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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartService } from '../services/part.services';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartGetResponseDto } from '../dtos/response/part.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { ENUM_PART_STATUS } from '../enums/part.enum';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  PartAdminCreateDoc,
  PartAdminDeleteDoc,
  PartAdminListDoc,
  PartAdminParamsIdDoc,
  PartAdminUpdateDoc,
  PartAdminUpdateStatusDoc,
} from '../docs/part.admin.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_PART_STATUS_CODE_ERROR } from '../enums/part.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
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
  PART_DEFAULT_AVAILABLE_ORDER_BY,
  PART_DEFAULT_AVAILABLE_SEARCH,
  PART_DEFAULT_STATUS,
} from '../constants/part.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { PartParsePipe } from '../pipes/part.parse.pipe';
import { PartDoc } from '../entities/part.entity';
import { IPartDoc } from '../interfaces/part.interface';
import { PartTypeService } from '@/modules/part-type/services/part-type.services';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';

@ApiTags('modules.admin.part')
@Controller({
  version: '1',
  path: '/part',
})
export class PartAdminController {
  constructor(
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly partTypeService: PartTypeService,
    private readonly partService: PartService,
    private readonly paginationService: PaginationService,
  ) {}

  @PartAdminListDoc()
  @ResponsePaging('part.list')
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
      availableSearch: PART_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: PART_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      PART_DEFAULT_STATUS,
      ENUM_PART_STATUS,
    )
    status: Record<string, any>,
    @Query('partType', OptionalParseUUIDPipe)
    partTypeId: string,
    @Query('vehicleBrand', OptionalParseUUIDPipe)
    vehicleBrandId: string,
  ): Promise<IResponsePaging<PartListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    if (partTypeId) {
      find['partType'] = partTypeId;
    }

    if (vehicleBrandId) {
      find['vehicleBrand'] = vehicleBrandId;
    }

    const parts = await this.partService.findAllWithVehicleBrandAndPartType(
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );

    const total: number =
      await this.partService.getTotalWithVehicleBrandAndPartType(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.partService.mapList(parts);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @PartAdminParamsIdDoc()
  @Response('part.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, PartParsePipe)
    part: PartDoc,
  ): Promise<IResponse<PartGetResponseDto>> {
    const partFull: IPartDoc = await this.partService.join(part);

    const mapped: PartGetResponseDto = this.partService.mapGet(partFull);
    return { data: mapped };
  }

  @PartAdminCreateDoc()
  @Response('part.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: PartCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.vehicleBrandService.findOneById(body.vehicleBrand),
      this.partTypeService.findOneById(body.partType),
      this.partService.findBySlug(body.slug),
    ];
    const [checkVehicleBrand, checkPartType, existingSlug] =
      await Promise.all(promises);

    if (!checkVehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    } else if (!checkPartType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part-type.error.notFound',
      });
    } else if (existingSlug) {
      throw new InternalServerErrorException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.SLUG_EXISTED,
        message: 'part.error.slugExisted',
      });
    }

    try {
      const created = await this.partService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);
      return { data: { _id: created._id } };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @PartAdminUpdateDoc()
  @Response('part.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, PartParsePipe) part: PartDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: PartUpdateRequestDto,
  ): Promise<void> {
    if (body.slug && body.slug !== part.slug) {
      const existingBySlug = await this.partService.findOne({
        slug: body.slug,
      });

      if (
        existingBySlug &&
        existingBySlug._id.toString() !== part._id.toString()
      ) {
        throw new ConflictException({
          statusCode: ENUM_PART_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'part.error.slugExisted',
        });
      }
    }

    try {
      await this.partService.update(part, body);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @PartAdminUpdateStatusDoc()
  @Response('part.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, PartParsePipe) part: PartDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: PartUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.partService.updateStatus(part, { status }, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
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
        message: 'part.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @PartAdminDeleteDoc()
  @Response('part.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, PartParsePipe) part: PartDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<IResponse<void>> {
    try {
      await this.partService.softDelete(part, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'part.error.deleteFailed',
        _error: err,
      });
    }
  }
}
