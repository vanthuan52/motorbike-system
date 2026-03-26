import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HiringModel } from '../models/hiring.model';
import { HiringResponseDto } from '../dtos/hiring-response.dto';

@Injectable()
export class HiringUtil {
  mapList(hiring: HiringModel[]): HiringResponseDto[] {
    return plainToInstance(HiringResponseDto, hiring);
  }

  mapOne(hiring: HiringModel): HiringResponseDto {
    return plainToInstance(HiringResponseDto, hiring);
  }
}
