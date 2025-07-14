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
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordMediaService } from '../services/care-record-media.service';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaGetResponseDto } from '../dtos/response/care-record-media.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecordMediaSharedCreateDoc,
  CareRecordMediaSharedDeleteDoc,
  CareRecordMediaSharedListDoc,
  CareRecordMediaSharedParamsIdDoc,
  CareRecordMediaSharedUpdateDoc,
} from '../docs/care-record-media.shared.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
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
  CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record-media.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordMediaParsePipe } from '../pipes/care-record-media.parse.pipe';
import { CareRecordMediaDoc } from '../entities/care-record-media.entity';
import { ICareRecordMediaDoc } from '../interfaces/care-record-media.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { CareRecordService } from '@/modules/care-record/services/care-record.service';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '@/modules/care-record/enums/care-record.status-code.enum';

@ApiTags('modules.shared.care-record-media')
@Controller({
  version: '1',
  path: '/care-record-media',
})
export class CareRecordMediaSharedController {
  constructor(
    private readonly careRecordService: CareRecordService,
    private readonly careRecordMediaService: CareRecordMediaService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordMediaSharedListDoc()
  @ResponsePaging('care-record-media.list')
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
      availableSearch: CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('careRecord', OptionalParseUUIDPipe)
    careRecordId: string,
  ): Promise<IResponsePaging<CareRecordMediaListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (careRecordId) {
      find['careRecord._id'] = careRecordId;
    }

    const CareRecordMedias =
      await this.careRecordMediaService.findAllWithPopulate(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.careRecordMediaService.getTotalWithPopulate(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.careRecordMediaService.mapList(CareRecordMedias);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareRecordMediaSharedParamsIdDoc()
  @Response('care-record-media.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordMediaParsePipe)
    careRecordMedia: CareRecordMediaDoc,
  ): Promise<IResponse<CareRecordMediaGetResponseDto>> {
    const careRecordMediaFull: ICareRecordMediaDoc =
      await this.careRecordMediaService.join(careRecordMedia);

    const mapped: CareRecordMediaGetResponseDto =
      this.careRecordMediaService.mapGet(careRecordMediaFull);
    return { data: mapped };
  }

  @CareRecordMediaSharedCreateDoc()
  @Response('care-record-media.create')
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
    @Body() body: CareRecordMediaCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.careRecordService.findOneById(body.careRecord),
    ];
    const [checkCareRecord] = await Promise.all(promises);

    if (!checkCareRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }

    try {
      const created = await this.careRecordMediaService.create(body, {
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

  @CareRecordMediaSharedUpdateDoc()
  @Response('care-record-media.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordMediaParsePipe)
    careRecordMedia: CareRecordMediaDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordMediaUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.careRecordMediaService.update(careRecordMedia, body, {
        actionBy: updatedBy,
      });
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @CareRecordMediaSharedDeleteDoc()
  @Response('care-record-media.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordMediaParsePipe)
    CareRecordMedia: CareRecordMediaDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordMediaService.softDelete(
        CareRecordMedia,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record-media.error.deleteFailed',
        _error: err,
      });
    }
  }
}
