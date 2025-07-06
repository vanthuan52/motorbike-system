import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { vehiclePartActions } from "../store/part-slice";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";

export const VehiclePartDetailPage: React.FC = () => {
  const { id } = useParams<{ action: string; id?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: vehiclePart,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.vehicleParts);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(vehiclePartActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

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
        vehiclePartActions.getPartDetail({
          partId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới phụ tùng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa phụ tùng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết phụ tùng";
      default:
        return "Phụ tùng";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!vehiclePart && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">Không tìm thấy phụ tùng</h2>
        ) : (
          <VehiclePartForm mode={mode} initialValues={vehiclePart} />
        )}
      </div>
    </div>
  );
};
