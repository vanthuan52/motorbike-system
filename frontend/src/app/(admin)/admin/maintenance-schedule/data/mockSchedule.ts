export interface ScheduleType {
  id: number;
  customer: string;
  phone: string;
  staff: { id: number; name: string } | null;
  schedule_date: string; // ISO
  time_slot: string;     // e.g. '08:00 - 10:00'
  status: boolean;
}

export const mockScheduleList: ScheduleType[] = [
  {
    id: 1,
    customer: 'Nguyễn Văn Tèo',
    phone: '0987654321',
    schedule_date: '2024-05-10',
    time_slot: '08:00 - 10:00',
    staff: { id: 1, name: 'Nguyen Van A' },
    status: false,
  },
  {
    id: 2,
    customer: 'Trần Thị Bé',
    phone: '0911222333',
    schedule_date: '2024-05-11',
    time_slot: '10:00 - 12:00',
    staff: { id: 2, name: 'Tran Thi B' },
    status: true,
  },
  {
    id: 3,
    customer: 'Lê Hữu Nhân',
    phone: '0909333444',
    schedule_date: '2024-05-12',
    time_slot: '13:00 - 15:00',
    staff: { id: 1, name: 'Nguyen Van A' },
    status: false,
  },
  {
    id: 4,
    customer: 'Phạm Thị Lan',
    phone: '0944555666',
    schedule_date: '2024-05-13',
    time_slot: '15:00 - 17:00',
    staff: { id: 2, name: 'Tran Thi B' },
    status: true,
  },
  {
    id: 5,
    customer: 'Đỗ Mạnh Hùng',
    phone: '0977888999',
    schedule_date: '2024-05-14',
    time_slot: '08:00 - 10:00',
    staff: null,
    status: false,
  }
];