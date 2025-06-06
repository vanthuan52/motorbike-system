import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ApiKeyService } from '../services/api-key.service';
import { ApiKeyDoc } from '../entities/api-key.entity';
import { ENUM_API_KEY_STATUS_CODE_ERROR } from '../enums/api-key.status-code.enum';

@Injectable()
export class ApiKeyParsePipe implements PipeTransform {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async transform(value: any) {
    const apiKey: ApiKeyDoc | null =
      await this.apiKeyService.findOneById(value);

    if (!apiKey) {
      throw new NotFoundException({
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'apiKey.error.notFound',
      });
    }

    return apiKey;
  }
}
