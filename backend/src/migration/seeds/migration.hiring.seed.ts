import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { HiringService } from '@/modules/hiring/services/hiring.services';
import { CandidateService } from '@/modules/hiring/services/candidate.services';
import { CandidateReviewService } from '@/modules/hiring/services/candidate-review.services';
import {
  ENUM_HIRING_STATUS,
  ENUM_HIRING_TYPE,
} from '@/modules/hiring/enums/hiring.enum';
import { ENUM_CANDIDATE_STATUS } from '@/modules/hiring/enums/candidate.enum';

@Injectable()
export class MigrationHiringSeed {
  constructor(
    private readonly hiringService: HiringService,
    private readonly candidateService: CandidateService,
    private readonly candidateReviewService: CandidateReviewService,
  ) {}

  @Command({
    command: 'seed:hiring',
    describe: 'Seed hiring, candidate and candidate-reviews',
  })
  async seed(): Promise<void> {
    const hiringList = [
      {
        title: 'Kỹ sư phần mềm',
        slug: 'ky-su-phan-mem',
        description: 'Lập trình và bảo trì hệ thống phần mềm.',
        requirements: ['Thành thạo TypeScript', 'Kinh nghiệm với NestJS'],
        location: 'Hồ Chí Minh',
        salaryRange: '20-30 triệu',
        applicationDeadline: new Date('2025-12-31'),
        category: 'IT',
        jobType: ENUM_HIRING_TYPE.FULL_TIME,
        status: ENUM_HIRING_STATUS.PUBLISHED,
      },
      {
        title: 'Nhân viên kinh doanh',
        slug: 'nhan-vien-kinh-doanh',
        description: 'Tìm kiếm và chăm sóc khách hàng.',
        requirements: ['Giao tiếp tốt', 'Ưu tiên có kinh nghiệm sales'],
        location: 'Hà Nội',
        salaryRange: '15-25 triệu',
        applicationDeadline: new Date('2025-11-30'),
        category: 'Kinh doanh',
        jobType: ENUM_HIRING_TYPE.FULL_TIME,
        status: ENUM_HIRING_STATUS.PUBLISHED,
      },
      {
        title: 'Chuyên viên marketing',
        slug: 'chuyen-vien-marketing',
        description: 'Xây dựng kế hoạch marketing tổng thể.',
        requirements: ['Hiểu biết về digital marketing', 'Sáng tạo'],
        location: 'Đà Nẵng',
        salaryRange: '18-28 triệu',
        applicationDeadline: new Date('2025-10-31'),
        category: 'Marketing',
        jobType: ENUM_HIRING_TYPE.CONTRACT,
        status: ENUM_HIRING_STATUS.DRAFT,
      },
    ];

    for (const hiringData of hiringList) {
      const hiring = await this.hiringService.create(hiringData);

      for (let i = 0; i < 2; i++) {
        const candidate = await this.candidateService.create({
          hiring: hiring._id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: `09${faker.string.numeric(8)}`,
          appliedAt: new Date(),
          status: ENUM_CANDIDATE_STATUS.NEW,
          experience: faker.lorem.sentence(),
          education: faker.lorem.sentence(),
        });

        for (let j = 0; j < 2; j++) {
          await this.candidateReviewService.create({
            candidate: candidate._id,
            user: 'c48738de-3ad5-4860-ba65-c96c97db4950',
            feedback: faker.lorem.sentences(2),
          });
        }
      }
    }
  }

  @Command({
    command: 'remove:hiring',
    describe: 'Remove all hirings, candidates, and candidate-reviews',
  })
  async remove(): Promise<void> {
    await this.candidateReviewService.deleteMany();
    await this.candidateService.deleteMany();
    await this.hiringService.deleteMany();
  }
}
