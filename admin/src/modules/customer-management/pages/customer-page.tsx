import { useNavigate } from "react-router-dom";
import { PageHeading } from "@/components/page-heading";
import { ROUTER_PATH } from "@/constants/router-path";
import CustomerList from "../components/customer-list";

export default function Customers() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`${ROUTER_PATH.CUSTOMERS_CREATION}`);
  };

  return (
    <div className="px-4 py-2 md:py-4 sm:pt-0">
      <PageHeading title="Danh sách khách hàng" onClick={handleCreate} />
      <CustomerList />
    </div>
  );
}
