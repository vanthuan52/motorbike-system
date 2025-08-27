import PageInfo from "@/components/page-info";
import UserVehicleList from "./user-vehicle-list";

export default function UserVehiclePage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách xe máy của khách hàng" />
        <UserVehicleList />
      </div>
    </div>
  );
}
