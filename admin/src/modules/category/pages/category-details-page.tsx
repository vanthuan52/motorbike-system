import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { RootState } from "@/store";
import { categoriesActions } from "../store/categories-slice";
import { Category, ENUM_PART_TYPE_STATUS } from "../types";
import CategoryForm from "../components/CategoryForm";
import SkeletonCategoryForm from "../components/SkeletonCategoryForm";
import { notificationActions } from "@/modules/notification/store/notification-slice";
export default function CategoryDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    detail: { data: categoryDetail, loading: isDetailLoading },
    update: { error, loading },
    updateStatus,
  } = useSelector((state: RootState) => state.categories);
  useEffect(() => {
    dispatch(categoriesActions.reset());
  }, [dispatch]);
  useEffect(() => {
    if (error || updateStatus.error) {
      notificationActions.notify({
        type: "error",
        message: error || updateStatus.error || "Có lỗi xảy ra khi cập nhật!",
      });
    }
  }, [error]);

  useEffect(() => {
    if (params.id) {
      dispatch(categoriesActions.fetchCategoryDetailRequest(params.id));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (categoryDetail) {
      form.setFieldsValue(categoryDetail);
    }
  }, [categoryDetail, form]);

  useEffect(() => {
    if (error || updateStatus.error) {
      notificationActions.notify({
        type: "error",
        message: error || updateStatus.error || "Có lỗi xảy ra khi cập nhật!",
      });
    }
  }, [error, updateStatus.error]);

  if (isDetailLoading) {
    return <SkeletonCategoryForm />;
  }

  if (!categoryDetail) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy danh mục!
      </div>
    );
  }

  const handleSave = async (values: Category) => {
    if (!params.id) return;
    dispatch(
      categoriesActions.updateCategoryRequest({
        id: params.id,
        category: values,
      })
    );

    dispatch(
      categoriesActions.updateStatusCategoryRequest({
        id: params.id,
        status: values.status
          ? ENUM_PART_TYPE_STATUS.ACTIVE
          : ENUM_PART_TYPE_STATUS.INACTIVE,
      })
    );
  };

  return (
    <CategoryForm
      initialValues={categoryDetail}
      onSubmit={handleSave}
      mode="edit"
      fileList={fileList}
      setFileList={setFileList}
      loading={loading}
    />
  );
}
