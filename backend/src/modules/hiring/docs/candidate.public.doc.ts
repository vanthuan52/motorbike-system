import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { CandidateGetResponseDto } from '../dtos/response/candidate.get.response.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';

export function CandidateUserCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a new candidate' }),
    DocRequest({
      queries: [],
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CandidateUserCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('candidate.create', {
      statusCode: HttpStatus.CREATED,
      dto: DatabaseIdResponseDto,
    }),
  );
}
