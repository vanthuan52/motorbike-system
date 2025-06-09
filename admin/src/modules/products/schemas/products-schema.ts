import * as yup from "yup";
import { InferType } from "yup";

export const productFormSchema = yup.object().shape({
  sku: yup.string().required("Vui lòng nhập mã sản phẩm"),
  name: yup.string().required("Vui lòng nhập tên sản phẩm"),
  brand_id: yup.string().required("Vui lòng nhập hãng"),
  description: yup.string(),
  price: yup
    .number()
    .typeError("Giá bán phải là số")
    .required("Vui lòng nhập giá bán")
    .min(0, "Giá bán phải >= 0"),
  cost: yup
    .number()
    .typeError("Giá nhập phải là số")
    .required("Vui lòng nhập giá nhập")
    .min(0, "Giá nhập phải >= 0"),
  image: yup.array().of(yup.string().url("Đường dẫn ảnh không hợp lệ")),
  stock: yup
    .number()
    .typeError("Tồn kho phải là số")
    .required("Vui lòng nhập tồn kho")
    .min(0, "Tồn kho phải >= 0"),
  colors: yup.array().of(yup.string()),
  category_id: yup.string().required("Vui lòng chọn danh mục"),
  status: yup
    .mixed<"in_stock" | "out_of_stock" | "out_of_business">()
    .oneOf(
      ["in_stock", "out_of_stock", "out_of_business"],
      "Trạng thái không hợp lệ"
    )
    .required("Vui lòng chọn trạng thái"),
  origin: yup.string().required("Vui lòng nhập xuất xứ"),
});

export type ProductFormType = InferType<typeof productFormSchema>;
