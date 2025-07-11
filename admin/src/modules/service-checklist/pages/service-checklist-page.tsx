import PageInfo from "@/components/page-info";
import ServiceChecklistList from "./service-checklist-list";

export default function ServiceChecklistPage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách công việc" />
        <ServiceChecklistList />
      </div>
    </div>
  );
}
