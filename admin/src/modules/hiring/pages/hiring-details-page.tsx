import { RootState } from "@/store";
import { Form } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { hiringActions } from "../store/hiring-slice";
import SkeletonHiringForm from "../components/SkeletonHiringForm";
import HiringForm from "../components/HiringForm";

export default function HiringDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    detail: { data: hiringDetail, loading: isDetailLoading },
    update: { error, loading },
    updateStatus,
  } = useSelector((state: RootState) => state.hiring);

  useEffect(() => {
    dispatch(hiringActions.reset());
  }, [dispatch]);

  useEffect(() => {
    if (error || updateStatus.error) {
      toast.error(error || updateStatus.error || "Có lỗi xảy ra khi cập nhật!");
    }
  }, [error]);

  useEffect(() => {
    if (params.id) {
      dispatch(hiringActions.fetchHiringDetailRequest(params.id));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (hiringDetail) {
      form.setFieldsValue(hiringDetail);
    }
  }, [hiringDetail, form]);
  const handleSave = async (values: any) => {
    if (!params.id) return;
    dispatch(
      hiringActions.updateHiringRequest({
        id: params.id,
        hiring: values,
      })
    );
  };
  if (isDetailLoading) {
    return <SkeletonHiringForm />;
  }

  if (!hiringDetail) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy bài tuyển dụng!
      </div>
    );
  }
  return (
    <HiringForm
      initialValues={hiringDetail}
      onSubmit={handleSave}
      mode="edit"
      loading={loading}
    />
  );
}
