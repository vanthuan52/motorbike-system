import { Card } from "antd";
import { CareRecord } from "../types";

export default function SummarySection({
  careRecord,
}: {
  careRecord?: CareRecord | null;
}) {
  return (
    <Card className="w-full !rounded-[30px] !bg-gray-200 p-4 !space-y-4">
      <h2 className="!text-lg !font-semibold">Summary</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Mã khuyến mãi"
          className="flex-1 px-3 py-2 !my-2 rounded-md border border-gray-300 text-sm bg-white"
        />
        <button className="px-4 py-2 bg-black !text-white rounded-md text-sm">
          Áp dụng
        </button>
      </div>

      <div className="text-sm !my-2 flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-gray-700 font-bold">Tổng cộng:</span>
          <span className="font-semibold">{careRecord?.totalCost} vnđ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-bold">Thành tiền:</span>
          <span className="font-semibold">{careRecord?.totalCost} vnđ</span>
        </div>
      </div>
    </Card>
  );
}
