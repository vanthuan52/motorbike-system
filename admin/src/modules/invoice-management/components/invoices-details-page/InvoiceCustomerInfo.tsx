import { Divider } from "antd";
import { MdEmail } from "react-icons/md";
import { PiShare } from "react-icons/pi";
import { User } from "@/modules/customer-management/types";
import { InvoiceManagement } from "../../types";

export default function InvoiceCustomerInfo({
  customer,
  invoice,
}: {
  customer: User;
  invoice: InvoiceManagement;
}) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 w-full lg:w-[350px] max-w-full lg:max-w-[400px] mt-4 lg:mt-0">
      <h1 className="text-lg sm:text-xl font-semibold">Khách hàng</h1>
      <div className="flex gap-4 items-center pt-4 flex-wrap">
        <img
          src={customer?.photo || ""}
          alt={customer?.name || ""}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-[20px]"
        />
        <div>
          <div className="flex justify-start items-center gap-2">
            <span className="font-semibold">{customer?.name}</span>
            <PiShare />
          </div>
          <p className="text-sm text-gray-500">10 đơn hàng trước</p>
        </div>
      </div>
      <Divider />
      <div className="flex gap-2 items-center">
        <MdEmail size={18} color="gray" />
        <span className="font-semibold text-base sm:text-lg text-gray-400 break-all">
          {customer?.email}
        </span>
      </div>
      <Divider />
      <div className="pt-4">
        <h1 className="text-base font-medium">Địa chỉ giao hàng</h1>
        <p className="text-sm text-gray-500 break-words">{customer?.address}</p>
      </div>
      <div className="pt-4">
        <h1 className="text-base font-medium">Địa chỉ hoá đơn</h1>
        <p className="text-sm text-gray-500 break-words">{invoice.address}</p>
      </div>
    </div>
  );
}
