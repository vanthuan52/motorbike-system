import PageInfo from "@/components/page-info";
import AppointmentsList from "./appointment-list";

export default function AppointmentsPage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách lịch hẹn" />
        <AppointmentsList />
      </div>
    </div>
  );
}
