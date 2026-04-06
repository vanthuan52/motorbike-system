import { Injectable } from '@nestjs/common';
import { ApplicationReviewResponseDto } from '../dtos/application-review.response.dto';
import { plainToInstance } from 'class-transformer';
import { ApplicationReviewModel } from '../models/application-review.model';

@Injectable()
export class ApplicationReviewUtil {
  mapList(
    applicationReviews: ApplicationReviewModel[]
  ): ApplicationReviewResponseDto[] {
    return plainToInstance(ApplicationReviewResponseDto, applicationReviews);
  }

  mapOne(
    applicationReview: ApplicationReviewModel
  ): ApplicationReviewResponseDto {
    return plainToInstance(ApplicationReviewResponseDto, applicationReview);
  }
}
