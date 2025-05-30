import { applyDecorators } from '@nestjs/common';
import {
  UserDocParamsId,
  UserDocQueryRoleType,
  UserDocQueryStatus,
} from '../constants/user.doc.constant';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';

export function UserAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all users',
    }),
    DocRequest({
      queries: [...UserDocQueryStatus, ...UserDocQueryRoleType],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<UserListResponseDto>('user.list', {
      dto: UserListResponseDto,
    }),
  );
}

export function UserAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<UserProfileResponseDto>('user.get', {
      dto: UserProfileResponseDto,
    }),
  );
}
