import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form } from "antd";
import { toast } from "react-toastify";
import type { UploadFile } from "antd/es/upload/interface";
import { RootState } from "@/store";
import { productsActions } from "../store/products-slice";
import ProductForm from "../components/ProductForm";
import SkeletonProductForm from "../components/SkeletonProductForm";

export default function ProductDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { productDetail, isDetailLoading } = useSelector(
    (state: RootState) => state.products
  );

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (params.slug) {
      dispatch(productsActions.fetchProductDetailRequest(params.slug));
    }
  }, [dispatch, params.slug]);

  useEffect(() => {
    if (productDetail) {
      form.setFieldsValue({
        ...productDetail,
        colors: productDetail.colors || [],
      });
    }
  }, [productDetail, form]);

  if (isDetailLoading) {
    return <SkeletonProductForm />;
  }

  if (!productDetail) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy sản phẩm!
      </div>
    );
  }
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(productsActions.updateProductRequest(values));
      toast.success("Cập nhật sản phẩm thành công!");
      dispatch(productsActions.fetchProductDetailRequest(params.slug));
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  return (
    <ProductForm
      initialValues={productDetail}
      onSubmit={handleSave}
      mode="edit"
      fileList={fileList}
      setFileList={setFileList}
    />
  );
}
