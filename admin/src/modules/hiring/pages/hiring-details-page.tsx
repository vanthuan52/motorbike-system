import { RootState, useAppDispatch } from "@/store";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { hiringActions } from "../store/hiring-slice";
import HiringForm from "../components/HiringForm";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import PageInfo from "@/components/page-info";

export default function HiringDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, isUpserted, isDeleted } = useSelector(
    (state: RootState) => state.hiring
  );

  const mode: ENUM_PAGE_MODE = useMemo(() => {
    if (!id || id === ENUM_PAGE_MODE.CREATE) {
      return ENUM_PAGE_MODE.CREATE;
    }
    if (searchParams.get("view") === "true") {
      return ENUM_PAGE_MODE.VIEW;
    }
    return ENUM_PAGE_MODE.EDIT;
  }, [id, searchParams]);
  useEffect(() => {
    if (id && (mode === ENUM_PAGE_MODE.EDIT || mode === ENUM_PAGE_MODE.VIEW)) {
      dispatch(hiringActions.getHiringDetail({ hiringId: id }));
    }

    return () => {
      dispatch(hiringActions.resetHiringDetail());
    };
  }, [id, mode, dispatch]);
  useEffect(() => {
    if (isUpserted || isDeleted) {
      navigate(-1);
      dispatch(hiringActions.resetState());
    }
  }, [isUpserted, navigate, dispatch]);
  const pageName = useMemo(() => {
    switch (mode) {
      case ENUM_PAGE_MODE.CREATE:
        return "Tạo mới bài tuyển dụng";
      case ENUM_PAGE_MODE.EDIT:
        return "Chỉnh sửa bài tuyển dụng";
      case ENUM_PAGE_MODE.VIEW:
        return "Chi tiết bài tuyển dụng";
      default:
        return "Bài tuyển dụng";
    }
  }, [mode]);
  return (
    <div className="w-full min-h-full">
      <div className="px-4 pt-3 pb-14 flex flex-col gap-3">
        <PageInfo name={pageName} />
        {loading &&
        (mode === ENUM_PAGE_MODE.EDIT || mode === ENUM_PAGE_MODE.VIEW) ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <HiringForm mode={mode} />
        )}
      </div>
    </div>
  );
}
