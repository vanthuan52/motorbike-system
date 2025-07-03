import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { servicePriceActions } from "../store/service-price-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import ServicePriceForm from "../components/service-price-form";

export default function ServicePriceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: ServicePrice,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.servicePrice);

  const mode: ENUM_PAGE_MODE = usePageMode();
  const isLoading =
    loadingSingle ||
    create.loading ||
    deletion.loading ||
    update.loading ||
    partialUpdate.loading;

  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(
        servicePriceActions.getServicePriceDetail({
          servicePriceId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(servicePriceActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới giá dịch vụ";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa giá dịch vụ";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết giá dịch vụ";
      default:
        return "Giá dịch vụ";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!ServicePrice && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">Không tìm thấy giá dịch vụ</h2>
        ) : (
          <ServicePriceForm mode={mode} initialValues={ServicePrice} />
        )}
      </div>
    </div>
  );
}
