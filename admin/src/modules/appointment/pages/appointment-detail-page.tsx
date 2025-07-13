import { usePageMode } from "@/hooks/use-page-mode";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentsActions } from "../store/appointment-slice";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import AppointmentsForm from "../components/appointment-form";

export default function AppointmentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    detail: Appointments,
    loadingSingle,
    create,
    update,
    deletion,
    partialUpdate,
  } = useAppSelector((state: RootState) => state.appointments);

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
        AppointmentsActions.getAppointmentDetail({
          appointmentId: id,
        })
      );
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(AppointmentsActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới lịch hẹn bảo dưỡng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa lịch hẹn bảo dưỡng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết lịch hẹn bảo dưỡng";
      default:
        return "Lịch hẹn bảo dưỡng";
    }
  }, [mode]);
  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!Appointments && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">
            Không tìm thấy danh mục dịch vụ
          </h2>
        ) : (
          <AppointmentsForm mode={mode} initialValues={Appointments} />
        )}
      </div>
    </div>
  );
}
