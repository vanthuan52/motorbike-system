import PageInfo from "@/components/page-info";
import CareRecordList from "./care-record-list";

export default function CareRecordPage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách hồ sơ chăm sóc khách hàng" />
        <CareRecordList />
      </div>
    </div>
  );
}
