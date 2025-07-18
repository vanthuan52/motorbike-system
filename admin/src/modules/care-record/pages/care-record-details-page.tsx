import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { usePageMode } from "@/hooks/use-page-mode";
import { LocalSpinner } from "@/components/ui/local-spinner";
import PageInfo from "@/components/page-info";
import CareRecordForm from "../components/CareRecordForm";
import { careRecordActions } from "../store/care-record-slice";

export default function CareRecordDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { careRecord, loadingSingle, create, update, deletion, partialUpdate } =
    useAppSelector((state: RootState) => state.careRecords);

  const mode: ENUM_PAGE_MODE = usePageMode();
  const isLoading =
    loadingSingle ||
    create.loading ||
    deletion.loading ||
    update.loading ||
    partialUpdate.loading;

  useEffect(() => {
    if (id && mode === ENUM_PAGE_MODE.EDIT) {
      dispatch(careRecordActions.getCareRecordDetail({ careRecordId: id }));
    }
  }, [id, mode, dispatch]);

  useEffect(() => {
    if (create.success || deletion.success) {
      navigate(-1);
      dispatch(careRecordActions.resetState());
    }
  }, [create.success, deletion.success, navigate, dispatch]);

  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới hồ sơ chăm sóc";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa hồ sơ chăm sóc";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết hồ sơ chăm sóc";
      default:
        return "hồ sơ chăm sóc";
    }
  }, [mode]);

  return (
    <div className="w-full min-h-full relative">
      {isLoading && <LocalSpinner text="Loading..." />}
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {!careRecord && mode === ENUM_PAGE_MODE.EDIT ? (
          <h2 className="text-center text-lg">Không tìm thấy hồ sơ chăm sóc</h2>
        ) : (
          <CareRecordForm mode={mode} initialValues={careRecord} />
        )}
      </div>
    </div>
  );
}
