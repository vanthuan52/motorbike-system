import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PasswordHistoryResponseDto } from '../dtos/response/password-history.response.dto';
import { PasswordHistoryModel } from '../models/password-history.model';

@Injectable()
export class PasswordHistoryUtil {
  mapList(
    passwordHistories: PasswordHistoryModel[]
  ): PasswordHistoryResponseDto[] {
    return plainToInstance(PasswordHistoryResponseDto, passwordHistories);
  }
}
