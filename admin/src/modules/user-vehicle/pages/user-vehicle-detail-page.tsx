import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { UserVehicleActions } from "../store/user-vehicle-slice";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import UserVehicleForm from "../components/user-vehicle-form";

export default function UserVehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: UserVehicle,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.userVehicle);

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
        UserVehicleActions.getUserVehicleDetail({
          userVehicleId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(UserVehicleActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới xe của người dùng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa xe của người dùng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết xe của người dùng";
      default:
        return "Xe của người dùng";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!UserVehicle && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">
            Không tìm thấy xe của người dùng
          </h2>
        ) : (
          <UserVehicleForm mode={mode} initialValues={UserVehicle} />
        )}
      </div>
    </div>
  );
}
