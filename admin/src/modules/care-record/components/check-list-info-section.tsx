import { getStatusText } from "@/modules/care-record-checklist/constants/care-record-checklist";
import { CareRecordChecklist } from "@/modules/care-record-checklist/types";
import { Button, Card, Checkbox } from "antd";

export default function CheckListInfoSection({
  careRecordChecklists,
  loadingCareRecordChecklists,
}: {
  careRecordChecklists: CareRecordChecklist[];
  loadingCareRecordChecklists: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-lg font-semibold mb-4">Danh sách công việc</h2>
        <Button color="default" variant="text">
          <span className="text-blue-600 font-semibold"> Bổ sung</span>
        </Button>
      </div>
      <div className="mt-2 border border-gray-300 rounded-lg">
        <div className="p-2">
          <div className="flex justify-between">
            <h3 className="font-semibold mb-2">Các công việc:</h3>
            <Button color="default" variant="text">
              <span className="text-blue-600 font-semibold">Chi tiết</span>
            </Button>
          </div>
          {loadingCareRecordChecklists ? (
            <ChecklistSkeleton count={3} />
          ) : (
            careRecordChecklists.map((item) => (
              <ChecklistItem key={item._id} item={item} />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function ChecklistItem({ item }: { item: CareRecordChecklist }) {
  const { serviceChecklist, wearPercentage, status } = item;

  return (
    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between gap-4 mb-4 hover:bg-gray-200">
      <div className="flex-shrink-0">
        <Checkbox />
      </div>

      <div className="flex-1">
        <p className="font-semibold">{serviceChecklist?.name}</p>
        <p>
          Mức độ hao mòn:{" "}
          {typeof wearPercentage === "number" ? `${wearPercentage}%` : "N/A"}
        </p>
        <p>
          Trạng thái:
          <span className="text-red-500 pl-2">{getStatusText(status)}</span>
        </p>
      </div>

      <div className="flex-shrink-0">
        <button className="bg-red-600 !text-white rounded-lg px-4 py-2 hover:bg-red-700 !font-medium">
          Kiểm tra
        </button>
      </div>
    </div>
  );
}

function ChecklistSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-100 p-4 rounded-lg flex items-center justify-between gap-4 mb-4 animate-pulse"
        >
          <div className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded" />

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-4 bg-gray-300 rounded w-1/4" />
          </div>

          <div className="flex-shrink-0">
            <div className="w-24 h-8 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
