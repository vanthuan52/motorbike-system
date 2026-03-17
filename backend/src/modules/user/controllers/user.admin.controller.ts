import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import {
  UserAdminCheckEmailDoc,
  UserAdminCheckPhoneDoc,
  UserAdminCreateDoc,
  UserAdminCreateShadowUserDoc,
  UserAdminDeleteDoc,
  UserAdminGetDoc,
  UserAdminListDoc,
  UserAdminUpdateDoc,
  UserAdminUpdateStatusDoc,
} from '../docs/user.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '../decorators/user.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterEqualString,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
  IPaginationEqual,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  UserDefaultAvailableSearch,
  UserDefaultStatus,
} from '../constants/user.list.contant';

import { EnumUserStatus } from '../enums/user.enum';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';
import { UserDto } from '../dtos/user.dto';
import {
  UserCheckEmailRequestDto,
  UserCheckPhoneRequestDto,
} from '../dtos/request/user.check.request.dto';
import { UserCheckEmailResponseDto } from '../dtos/response/user.check-email.response.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { UserCheckPhoneResponseDto } from '../dtos/response/user.check-phone.response.dto';
import { UserUtil } from '../utils/user.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { UserCreateShadowUserRequestDto } from '../dtos/request/user.create-shadow-user.request.dto';

@ApiTags('modules.admin.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserAdminController {
  private readonly logger = new Logger(UserAdminController.name);
  constructor(
    private readonly userService: UserService,
    private readonly userUtil: UserUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @UserAdminListDoc()
  @ResponsePaging('user.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: UserDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum<EnumUserStatus>('status', UserDefaultStatus)
    status?: Record<string, IPaginationIn>,
    @PaginationQueryFilterEqualString('role')
    role?: Record<string, IPaginationEqual>,
  ): Promise<IResponsePagingReturn<UserListResponseDto>> {
    const { data, total } = await this.userService.getListOffset(
      pagination,
      status,
      role,
    );
    const mappedData = this.userUtil.mapList(data);

    return this.paginationUtil.formatOffset(mappedData, total, pagination);
  }

  @UserAdminGetDoc()
  @Response('user.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:userId')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  async get(
    @Param('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
  ): Promise<IResponseReturn<UserProfileResponseDto>> {
    const user = await this.userService.findOneWithRoleById(userId);
    const mapped = this.userUtil.mapProfile(user);
    return {
      data: mapped,
    };
  }

  @UserAdminGetDoc()
  @Response('user.getByPhone')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/phone/:phone')
  async getByPhone(
    @Param('phone', RequestRequiredPipe)
    phone: string,
  ): Promise<IResponseReturn<UserDto>> {
    const user = await this.userService.findOneByPhone(phone);
    const mapped = this.userUtil.mapOne(user);
    return {
      data: mapped,
    };
  }

  @UserAdminCreateDoc()
  @Response('user.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async createUserTypeUser(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: UserCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.userService.createByAdmin(body, {
      actionBy: createdBy,
    });
    const mapped = this.userUtil.mapOne(created);
    return {
      data: {
        _id: mapped._id,
      },
    };
  }

  @UserAdminCreateShadowUserDoc()
  @Response('user.createShadowUser')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/pre-create')
  async preRegisterUser(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: UserCreateShadowUserRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.userService.createShadowUser(body, {
      actionBy: createdBy,
    });
    const mapped = this.userUtil.mapOne(created);
    return {
      data: {
        _id: mapped._id,
      },
    };
  }

  @UserAdminUpdateDoc()
  @Response('user.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:userId')
  async update(
    @Param('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: UserUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.userService.update(userId, body, {
      actionBy: updatedBy,
    });
    return {};
  }

  @UserAdminUpdateStatusDoc()
  @Response('user.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:userId/status')
  async updateStatus(
    @Param('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
    @AuthJwtPayload('user') actionBy: string,
    @Body() body: UserUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.userService.updateStatus(userId, body, { actionBy });
    return {};
  }

  @UserAdminDeleteDoc()
  @Response('user.deleted')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:userId')
  async delete(
    @Param('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
    @AuthJwtPayload('user') actionBy: string,
  ): Promise<IResponseReturn<void>> {
    await this.userService.softDelete(userId, { actionBy });
    return {};
  }

  @UserAdminCheckEmailDoc()
  @Response('user.checkEmail')
  @HttpCode(HttpStatus.OK)
  @Post('/check/email')
  async checkEmail(
    @Body() { email }: UserCheckEmailRequestDto,
  ): Promise<IResponseReturn<UserCheckEmailResponseDto>> {
    const exist = await this.userService.existByEmail(email);
    return {
      data: {
        exist,
      },
    };
  }

  @UserAdminCheckPhoneDoc()
  @Response('user.checkPhone')
  @HttpCode(HttpStatus.OK)
  @Post('/check/phone')
  async checkPhone(
    @Body() { phone }: UserCheckPhoneRequestDto,
  ): Promise<IResponseReturn<UserCheckPhoneResponseDto>> {
    const exist = await this.userService.existByPhone(phone);
    return {
      data: {
        exist,
      },
    };
  }
}
