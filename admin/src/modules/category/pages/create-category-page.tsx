import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import { categoriesActions } from "../store/categories-slice";
import CategoryForm from "../components/CategoryForm";
import { Category } from "../types";
import { RootState } from "@/store";
export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    create: { success, error, loading },
  } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(categoriesActions.reset());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate(ROUTER_PATH.CATEGORY);
    }
    if (error) {
      toast.error(error || "Có lỗi xảy ra khi tạo!");
    }
  }, [success, error, navigate]);

  const handleSave = (values: Category) => {
    dispatch(categoriesActions.createCategoryRequest({ category: values }));
  };

  return (
    <CategoryForm
      onSubmit={handleSave}
      mode="create"
      fileList={fileList}
      setFileList={setFileList}
      loading={loading}
    />
  );
}
