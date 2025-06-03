import { Request } from 'express';
import { ResponsePagingMetadataPaginationRequestDto } from '@/common/response/dtos/response.paging.dto';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';

export interface IRequestApp<
  T extends Express.User = IAuthJwtAccessTokenPayload,
> extends Request {
  //apiKey?: ApiKeyPayloadDto;
  user?: T;

  __user?: IUserDoc;
  __language: string;
  __version: string;

  __pagination?: ResponsePagingMetadataPaginationRequestDto;
}
