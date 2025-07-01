import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { vehicleServiceActions } from "../store/vehicle-service-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import VehicleServiceForm from "../components/vehicle-service-form";

export default function VehicleServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: vehicleService,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.vehicleService);

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
        vehicleServiceActions.getVehicleServiceDetail({
          vehicleServiceId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(vehicleServiceActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới dịch vụ xe máy";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa dịch vụ xe máy";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết dịch vụ xe máy";
      default:
        return "Dịch vụ xe máy";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!vehicleService && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">
            Không tìm thấy danh mục dịch vụ
          </h2>
        ) : (
          <VehicleServiceForm mode={mode} initialValues={vehicleService} />
        )}
      </div>
    </div>
  );
}
