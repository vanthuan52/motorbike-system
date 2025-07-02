import PageInfo from "@/components/page-info";
import ServiceCategoryList from "./vehicle-brand-list";

export default function VehicleBrandPage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách hãng xe" />
        <ServiceCategoryList />
      </div>
    </div>
  );
}
