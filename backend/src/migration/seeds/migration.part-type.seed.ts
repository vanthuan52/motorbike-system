import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { MessageService } from '@/common/message/services/message.service';
import { PartTypeService } from '@/modules/part-type/services/part-type.services';

@Injectable()
export class MigrationPartTypeSeed {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly messageService: MessageService
  ) {}

  @Command({
    command: 'seed:part-type',
    describe: 'Seed initial part types',
  })
  async createMany(): Promise<void> {
    const partTypes = [
      {
        name: 'Lọc gió',
        slug: 'loc-gio',
        description: 'Phụ tùng giúp lọc không khí trước khi vào động cơ',
        photo: '',
      },
      {
        name: 'Nhớt máy',
        slug: 'nhot-may',
        description: 'Dầu nhớt bôi trơn động cơ',
        photo: '',
      },
      {
        name: 'Bugi',
        slug: 'bugi',
        description: 'Phụ tùng đánh lửa trong động cơ',
        photo: '',
      },
    ];

    for (const partType of partTypes) {
      await this.partTypeService.upsertForMigration(partType);
    }
  }
  async seeds(): Promise<void> {
    try {
      await this.createMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
    return;
  }
  @Command({
    command: 'remove:part-type',
    describe: 'Remove all part types',
  })
  async remove(): Promise<void> {
    try {
      await this.partTypeService.deleteMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
    return;
  }
}
