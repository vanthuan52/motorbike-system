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
import { CareRecordConditionService } from '../services/care-record-condition.service';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { Response } from '@/common/response/decorators/response.decorator';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { CareRecordConditionGetResponseDto } from '../dtos/response/care-record-condition.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
} from '@/common/database/interfaces/database.interface';

import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecordConditionAdminCreateDoc,
  CareRecordConditionAdminUpdateDoc,
  CareRecordConditionAdminDeleteDoc,
  CareRecordConditionAdminParamsIdDoc,
} from '../docs/care-record-condition.admin.doc';
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
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordConditionParsePipe } from '../pipes/care-record-condition.parse.pipe';
import { CareRecordConditionDoc } from '../entities/care-record-condition.entity';
import { CareRecordService } from '@/modules/care-record/services/care-record.service';
import { ENUM_CARE_RECORD_CONDITION_STATUS_CODE_ERROR } from '../enums/care-record-condition.status-code.enum';

@ApiTags('modules.admin.care-record-condition')
@Controller({
  version: '1',
  path: '/care-record-condition',
})
export class CareRecordConditionAdminController {
  private readonly logger = new Logger(CareRecordConditionAdminController.name);
  constructor(
    private readonly careRecordConditionService: CareRecordConditionService,
    private readonly careRecordService: CareRecordService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordConditionAdminParamsIdDoc()
  @Response('care-record.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordConditionParsePipe)
    careRecordCondition: CareRecordConditionDoc,
  ): Promise<IResponse<CareRecordConditionGetResponseDto>> {
    const mapped: CareRecordConditionGetResponseDto =
      this.careRecordConditionService.mapGet(careRecordCondition);
    return { data: mapped };
  }

  @CareRecordConditionAdminCreateDoc()
  @Response('care-record-condition.create')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordConditionCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.careRecordService.findOneById(body.careRecord),
    ];
    const [checkCareRecord] = await Promise.all(promises);

    if (!checkCareRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_CONDITION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record-condition.error.notFound',
      });
    }

    try {
      const created = await this.careRecordConditionService.create(body, {
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

  @CareRecordConditionAdminUpdateDoc()
  @Response('care-record-condition.update')
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordConditionParsePipe)
    careRecordCondition: CareRecordConditionDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordConditionUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.careRecordConditionService.update(careRecordCondition, body, {
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

  @CareRecordConditionAdminDeleteDoc()
  @Response('care-record.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordConditionParsePipe)
    careRecord: CareRecordConditionDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordConditionService.delete(
        careRecord,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record.error.deleteFailed',
        _error: err,
      });
    }
  }
}
