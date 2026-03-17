import { Injectable } from '@nestjs/common';
import { CandidateDoc, CandidateEntity } from '../entities/candidate.entity';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CandidateUtil {
  mapList(
    candidates: CandidateDoc[] | CandidateEntity[],
  ): CandidateResponseDto[] {
    return plainToInstance(CandidateResponseDto, candidates);
  }

  mapOne(candidate: CandidateDoc | CandidateEntity): CandidateResponseDto {
    return plainToInstance(CandidateResponseDto, candidate);
  }
}
