import PageInfo from "@/components/page-info";
import ModelServicePriceList from "../components/model-service-price-list";
import { useParams, useSearchParams } from "react-router-dom";

export default function ModelServicePricePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string; name: string }>();

  return (
    <div className="w-full min-h-full">
      {id ? (
        <div className="px-4 py-3 flex flex-col gap-3">
          <PageInfo name={`Danh sách giá cho: ${searchParams.get("name")}`} />
          <ModelServicePriceList vehicleServiceId={id} />
        </div>
      ) : (
        <PageInfo name="Không tìm thấy dịch vụ" />
      )}
    </div>
  );
}
