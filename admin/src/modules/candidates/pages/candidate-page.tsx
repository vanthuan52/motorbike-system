import PageInfo from "@/components/page-info";
import CandidateList from "../components/candidate-list";

export default function CandidatePage() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách ứng viên" />
        <CandidateList />
      </div>
    </div>
  );
}
