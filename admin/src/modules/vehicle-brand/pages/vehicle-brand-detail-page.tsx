import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { vehicleBrandActions } from "../store/vehicle-brand-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import VehicleBrandForm from "../components/vehicle-brand-form";

export default function VehicleBrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: vehicleBrand,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.vehicleBrand);

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
        vehicleBrandActions.getVehicleBrandDetail({
          vehicleBrandId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(vehicleBrandActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới Hãng xe";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa Hãng xe";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết Hãng xe";
      default:
        return "Hãng xe";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!vehicleBrand && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">Không tìm thấy hãng xe</h2>
        ) : (
          <VehicleBrandForm mode={mode} initialValues={vehicleBrand} />
        )}
      </div>
    </div>
  );
}
