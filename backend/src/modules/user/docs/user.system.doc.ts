import { applyDecorators } from '@nestjs/common';
import { UserShortResponseDto } from '../dtos/response/user.short.response.dto';
import {
  UserDocQueryRoleType,
  UserDocQueryStatus,
} from '../constants/user.doc.constant';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { UserCheckEmailRequestDto } from '../dtos/request/user.check.request.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { UserCheckResponseDto } from '../dtos/response/user.check.response.dto';

export function UserSystemListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of users',
    }),
    DocRequest({
      queries: [...UserDocQueryStatus, ...UserDocQueryRoleType],
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponsePaging<UserShortResponseDto>('user.list', {
      dto: UserShortResponseDto,
    }),
  );
}

export function UserSystemCheckEmailDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'check user exist by email',
    }),
    DocRequest({
      dto: UserCheckEmailRequestDto,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponse<UserCheckResponseDto>('user.checkEmail', {
      dto: UserCheckResponseDto,
    }),
  );
}
