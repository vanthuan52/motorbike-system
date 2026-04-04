import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { JobApplicationDocQueryJobApplicationId } from '../constants/application-review.doc.constants';
import { ApplicationReviewCreateRequestDto } from '../dtos/request/application-review.create.request.dto';
import { ApplicationReviewResponseDto } from '../dtos/application-review.response.dto';

export function ApplicationReviewAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all jobApplication reviews',
    }),
    DocRequest({
      queries: [...JobApplicationDocQueryJobApplicationId],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ApplicationReviewResponseDto>('application-review.list', {
      dto: ApplicationReviewResponseDto,
    })
  );
}

export function ApplicationReviewAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a new jobApplication review' }),
    DocRequest({
      queries: [],
      dto: ApplicationReviewCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('application-review.create', {
      statusCode: HttpStatus.CREATED,
      dto: DatabaseIdDto,
    })
  );
}
