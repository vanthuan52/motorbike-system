import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { HelloResponseDto } from '../dtos/response/hello.response.dto';

export function HelloPublicDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'hello test api',
    }),
    DocResponse<HelloResponseDto>('app.hello', {
      dto: HelloResponseDto,
    }),
  );
}
