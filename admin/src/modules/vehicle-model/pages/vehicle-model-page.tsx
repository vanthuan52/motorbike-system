import PageInfo from "@/components/page-info";
import VehicleModelList from "./vehicle-model-list";

export default function VehicleServicePage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách dòng xe" />
        <VehicleModelList />
      </div>
    </div>
  );
}
