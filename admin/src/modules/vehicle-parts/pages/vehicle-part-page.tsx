import PageInfo from "@/components/page-info";
import VehiclePartList from "./vehicle-part-list";

export default function VehiclePartsPage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách phụ tùng" />
        <VehiclePartList />
      </div>
    </div>
  );
}
