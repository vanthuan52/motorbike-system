import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { CandidateUserCreateRequestDto } from '../dtos/request/candidate.create.request.dto';
import { CandidateGetResponseDto } from '../dtos/response/candidate.get.response.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export function CandidatePublicCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a new candidate' }),
    DocRequest({
      queries: [],
      bodyType: EnumDocRequestBodyType.json,
      dto: CandidateUserCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('candidate.create', {
      statusCode: HttpStatus.CREATED,
      dto: DatabaseIdDto,
    }),
  );
}
