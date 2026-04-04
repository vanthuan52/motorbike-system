import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { JobService } from '@/modules/job/services/job.service';
import { JobApplicationService } from '@/modules/job/services/job-application.service';
import { ApplicationReviewService } from '@/modules/job/services/application-review.service';
import {
  EnumJobStatus,
  EnumJobType,
  EnumJobApplicationStatus,
} from '@/modules/job/enums/job.enum';
@Injectable()
export class MigrationJobSeed {
  constructor(
    private readonly jobService: JobService,
    private readonly jobApplicationService: JobApplicationService,
    private readonly applicationReviewService: ApplicationReviewService
  ) {}

  @Command({
    command: 'seed:job',
    describe: 'Seed job, jobApplication and application-reviews',
  })
  async seed(): Promise<void> {
    const jobList = [
      {
        title: 'Kỹ sư phần mềm',
        slug: 'ky-su-phan-mem',
        description: 'Lập trình và bảo trì hệ thống phần mềm.',
        requirements: ['Thành thạo TypeScript', 'Kinh nghiệm với NestJS'],
        location: 'Hồ Chí Minh',
        salaryRange: '20-30 triệu',
        applicationDeadline: new Date('2025-12-31'),
        category: 'IT',
        jobType: EnumJobType.fullTime,
        status: EnumJobStatus.published,
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
        jobType: EnumJobType.fullTime,
        status: EnumJobStatus.published,
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
        jobType: EnumJobType.contract,
        status: EnumJobStatus.draft,
      },
    ];

    for (const jobData of jobList) {
      const job = await this.jobService.create(jobData);

      for (let i = 0; i < 2; i++) {
        const jobApplication = await this.jobApplicationService.create({
          job: job._id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: `09${faker.string.numeric(8)}`,
          appliedAt: new Date(),
          status: EnumJobApplicationStatus.new,
          experience: faker.lorem.sentence(),
          education: faker.lorem.sentence(),
        });

        for (let j = 0; j < 2; j++) {
          await this.applicationReviewService.create({
            jobApplication: jobApplication._id,
            user: 'c48738de-3ad5-4860-ba65-c96c97db4950',
            feedback: faker.lorem.sentences(2),
          });
        }
      }
    }
  }

  @Command({
    command: 'remove:job',
    describe: 'Remove all jobs, jobApplications, and application-reviews',
  })
  async remove(): Promise<void> {
    await this.applicationReviewService.deleteMany();
    await this.jobApplicationService.deleteMany();
    await this.jobService.deleteMany();
  }
}
