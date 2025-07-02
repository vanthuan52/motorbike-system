import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ENUM_PART_STATUS } from '@/modules/part/enums/part.enum';
import { PartService } from '@/modules/part/services/part.services';

@Injectable()
export class MigrationPartSeed {
  constructor(private readonly partService: PartService) {}

  @Command({
    command: 'seed:part',
    describe: 'Seed initial parts',
  })
  async createMany(): Promise<void> {
    const parts = [
      {
        name: 'Lọc gió AirBlade 2024',
        slug: 'loc-gio-airblade-2024',
        code: 'LGAB2024',
        branch: '1fb6f64b-b7ee-4cb5-b86e-45b5bf8b9f7b',
        type: '1fb6f64b-b7ee-4cb5-b86e-45b5bf8b9f7b',
        description: 'Phụ tùng lọc gió chính hãng cho xe AirBlade 2024',
      },
      {
        name: 'Nhớt máy Shell 10W40',
        slug: 'nhot-may-shell-10w40',
        code: 'NMSH10W40',
        branch: '1fb6f64b-b7ee-4cb5-b86e-45b5bf8b9f7b',
        type: '1fb6f64b-b7ee-4cb5-b86e-45b5bf8b9f7b',
        description: 'Dầu nhớt Shell phù hợp với nhiều dòng xe tay ga',
      },
      {
        name: 'Bugi NGK CR7HSA',
        slug: 'bugi-ngk-cr7hsa',
        code: 'BGNGKCR7',
        branch: '1fb6f64b-b7ee-4cb5-b86e-45b5bf8b9f7b',
        type: '1fb6f64b-b7ee-4cb5-b86e-45b5bf8b9f7b',
        description: 'Bugi đánh lửa chất lượng cao từ thương hiệu NGK',
      },
    ];

    for (const part of parts) {
      const exist = await this.partService.existByCode(part.code);
      if (!exist) {
        await this.partService.create({
          ...part,
          status: ENUM_PART_STATUS.ACTIVE,
        });
      }
    }
  }

  async seeds(): Promise<void> {
    try {
      await this.createMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }

  @Command({
    command: 'remove:part',
    describe: 'Remove all parts',
  })
  async remove(): Promise<void> {
    try {
      await this.partService.deleteMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }
}
