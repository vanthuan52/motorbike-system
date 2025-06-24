import { ENUM_PAGE_MODE } from "@/types/app.type";
import HiringForm from "../components/HiringForm";
import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import { hiringActions } from "../store/hiring-slice";

export default function CreateHiringPage() {
  const { isUpserted, isDeleted } = useAppSelector(
    (state: RootState) => state.hiring
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isUpserted || isDeleted) {
      navigate(-1);
      dispatch(hiringActions.resetState());
    }
  }, [isUpserted, navigate, dispatch]);
  return (
    <div className="w-full min-h-full">
      <div className="p-4">
        <h2 className="text-2xl font-semibold py-2">Tạo mới tin tuyển dụng</h2>
        <HiringForm mode={ENUM_PAGE_MODE.CREATE} />
      </div>
    </div>
  );
}
