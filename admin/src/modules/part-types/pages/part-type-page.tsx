import PageInfo from "@/components/page-info";
import PartTypeList from "./part-type-list";

export default function PartTypePage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách danh mục phụ tùng" />
        <PartTypeList />
      </div>
    </div>
  );
}
