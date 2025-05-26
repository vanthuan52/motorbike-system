import { ResponsePagingMetadataPaginationRequestDto } from '@/common/response/dtos/response.paging.dto';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { Request } from 'express';

export interface IRequestApp<T = IAuthJwtAccessTokenPayload> extends Request {
  // apiKey?: ApiKeyPayloadDto;
  user?: T;

  __user?: IUserDoc;
  __language: string;
  __version: string;

  __pagination?: ResponsePagingMetadataPaginationRequestDto;
}
