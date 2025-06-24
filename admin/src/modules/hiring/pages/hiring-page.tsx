import PageInfo from "@/components/page-info";
import HiringList from "../components/HiringList";

export default function HiringPage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách tuyển dụng" />
        <HiringList />
      </div>
    </div>
  );
}
