import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { StoreService } from '@/modules/store/services/store.services';
import { MessageService } from '@/common/message/services/message.service';
import { ENUM_STORE_STATUS } from '@/modules/store/enums/store.enum';

@Injectable()
export class MigrationStoreSeed {
  constructor(
    private readonly storeService: StoreService,
    private readonly messageService: MessageService,
  ) {}

  @Command({
    command: 'seed:store',
    describe: 'Seed initial store data',
  })
  async createMany(): Promise<void> {
    const stores = [
      {
        name: 'Cửa hàng Quận 1',
        slug: 'cua-hang-quan-1',
        address: '123 Lý Tự Trọng, Quận 1, TP.HCM',
        workHours: '08:00 - 18:00',
      },
      {
        name: 'Cửa hàng Gò Vấp',
        slug: 'cua-hang-go-vap',
        address: '45 Phạm Văn Chiêu, Gò Vấp, TP.HCM',
        workHours: '08:30 - 19:00',
      },
      {
        name: 'Cửa hàng Hà Nội',
        slug: 'cua-hang-ha-noi',
        address: '56 Đường Láng, Đống Đa, Hà Nội',
        workHours: '07:30 - 17:30',
      },
      {
        name: 'Cửa hàng Biên Hòa',
        slug: 'cua-hang-bien-hoa',
        address: '789 Phạm Văn Thuận, Biên Hòa, Đồng Nai',
        workHours: '09:00 - 18:00',
      },
    ];

    for (const store of stores) {
      const exist = await this.storeService.existsBySlug(store.slug);
      if (!exist) {
        await this.storeService.create({
          ...store,
          status: ENUM_STORE_STATUS.ACTIVE,
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
    command: 'remove:store',
    describe: 'Remove all stores',
  })
  async remove(): Promise<void> {
    try {
      await this.storeService.deleteMany();
    } catch (err: any) {
      throw new Error(err.message || err);
    }
    return;
  }
}
