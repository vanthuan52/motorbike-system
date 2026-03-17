import { Injectable } from '@nestjs/common';
import { HiringDoc, HiringEntity } from '../entities/hiring.entity';
import { HiringResponseDto } from '../dtos/hiring-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HiringUtil {
  mapList(hiring: HiringDoc[] | HiringEntity[]): HiringResponseDto[] {
    return plainToInstance(HiringResponseDto, hiring);
  }

  mapOne(hiring: HiringDoc | HiringEntity): HiringResponseDto {
    return plainToInstance(HiringResponseDto, hiring);
  }

  //    mapList(hiring: HiringDoc[] | HiringEntity[]): HiringListResponseDto[] {
  //     return plainToInstance(
  //       HiringListResponseDto,
  //       hiring.map((h: HiringDoc | HiringEntity) =>
  //         typeof (h as any).toObject === 'function' ? (h as any).toObject() : h,
  //       ),
  //     );
  //   }

  //   mapGet(hiring: HiringDoc | HiringEntity): HiringGetResponseDto {
  //     return plainToInstance(
  //       HiringGetResponseDto,
  //       typeof (hiring as any).toObject === 'function'
  //         ? (hiring as any).toObject()
  //         : hiring,
  //     );
  //   }
}
