import type { Metadata } from 'next';
import ScheduleList from '../components/ScheduleList';

export const metadata: Metadata = {
  title: 'Quản lý lịch bảo dưỡng | Motorbike',
  description: 'Trang Quản lý lịch bảo dưỡng hệ thống Motorbike',
};

export default function MaintenanceSchedule() {
  return <ScheduleList />;
}