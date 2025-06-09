import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Form } from "antd";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import ProductForm from "../components/ProductForm";
import { productsActions } from "../store/products-slice";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
export default function CreateProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(productsActions.createProductRequest(values));
      toast.success("Cập nhật sản phẩm thành công!");
      navigate(ROUTER_PATH.PRODUCTS);
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };
  return (
    <ProductForm
      onSubmit={handleSave}
      mode="create"
      fileList={fileList}
      setFileList={setFileList}
    />
  );
}
