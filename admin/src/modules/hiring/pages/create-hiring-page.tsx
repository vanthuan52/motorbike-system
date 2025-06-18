import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hiringActions } from "../store/hiring-slice";
import { useEffect } from "react";
import { ROUTER_PATH } from "@/constants/router-path";
import { toast } from "react-toastify";
import HiringForm from "../components/HiringForm";

export default function CreateHiringPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    create: { success, error, loading },
  } = useSelector((state: RootState) => state.hiring);
  useEffect(() => {
    dispatch(hiringActions.reset());
  }, [dispatch]);
  useEffect(() => {
    if (success) {
      navigate(ROUTER_PATH.HIRING);
    }
    if (error) {
      toast.error(error || "Có lỗi xảy ra khi tạo!");
    }
  }, [success, error, navigate]);
  const handleSave = (values: any) => {
    dispatch(hiringActions.createHiringRequest({ hiring: values }));
  };
  return <HiringForm onSubmit={handleSave} mode="create" loading={loading} />;
}
