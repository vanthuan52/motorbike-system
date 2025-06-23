import CustomerList from "../components/customer-list";
import PageInfo from "@/components/page-info";

export default function Customers() {
  return (
    <div className="w-full min-h-full">
      <div className="px-4 py-3 flex flex-col gap-3">
        <PageInfo name="Danh sách khách hàng" />
        <CustomerList />
      </div>
    </div>
  );
}
