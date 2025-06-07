import slugify from "slugify";
import {
  Button,
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { Product } from "../types";
import { getBase64 } from "@/modules/vehicle-parts/utils/fillUtils";
const { Option } = Select;
interface FormValues {
  sku: string;
  name: string;
  brand_id: string;
  description: string;
  cost: number;
  price: number;
  image: string[];
  stock: number;
  colors: string[];
  category_id: string;
  status: "in_stock" | "out_of_stock" | "out_of_business";
  origin: string;
  slug: string;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: Product | null;
  onCancel: () => void;
  onSubmit: (values: Product) => void;
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[]) => void;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export default function ProductsModal({
  visible,
  mode,
  initialData,
  onCancel,
  onSubmit,
  fileList,
  setFileList,
}: Props) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          sku: initialData.sku,
          name: initialData.name,
          brand_id: initialData.brand_id,
          description: initialData.description,
          price: initialData.price,
          cost: initialData.cost,
          stock: initialData.stock,
          colors: initialData.colors,
          category_id: initialData.category_id,
          status: initialData.status,
          origin: initialData.origin,
          slug: initialData.slug,
        });
        if (initialData.image && Array.isArray(initialData.image)) {
          setFileList(
            initialData.image.map((img, idx) => ({
              uid: String(-idx - 1),
              name: `image-${idx}.jpg`,
              status: "done",
              url: img.startsWith("/") ? img : "/" + img,
            }))
          );
        }
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "in_stock" });
    }
  }, [visible, mode, initialData, form, setFileList]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const imageUrls =
        fileList && fileList.length > 0
          ? fileList.map((file: UploadFile) => file.url || file.thumbUrl)
          : [];
      const product: Product = {
        id: initialData?.id ?? "",
        sku: values.sku,
        name: values.name,
        brand_id: values.brand_id,
        description: values.description,
        cost: values.cost,
        price: values.price,
        image: imageUrls.filter(
          (url): url is string => typeof url === "string"
        ),
        stock: values.stock,
        colors: values.colors,
        category_id: values.category_id,
        status: values.status,
        origin: values.origin,
        slug: values.slug,
      };
      onSubmit(product);
    } catch {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden
      okText={mode === "edit" ? "Lưu" : "Thêm"}
      cancelText="Hủy"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2"
        onValuesChange={(changed) => {
          if ("name" in changed) {
            const slug = slugify(changed.name || "", {
              lower: true,
              locale: "vi",
              strict: true,
            });
            form.setFieldsValue({ slug });
          }
        }}
      >
        <Form.Item
          label="SKU"
          name="sku"
          rules={[{ required: true, message: "Vui lòng nhập SKU" }]}
        >
          <Input placeholder="Nhập SKU" />
        </Form.Item>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Hãng"
          name="brand_id"
          rules={[{ required: true, message: "Vui lòng nhập hãng" }]}
        >
          <Input placeholder="Nhập hãng" />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="category_id"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục">
            {mockDataTableVehiclePart.map((item) => (
              <Option key={item.vehicle_type_id} value={item.vehicle_type_id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Xuất xứ"
          name="origin"
          rules={[{ required: true, message: "Vui lòng nhập xuất xứ" }]}
        >
          <Input placeholder="Nhập xuất xứ" />
        </Form.Item>

        <Form.Item
          label="Tình trạng"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
        >
          <Select placeholder="Chọn tình trạng">
            <Option value="in_stock">Còn hàng</Option>
            <Option value="out_of_stock">Hết hàng</Option>
            <Option value="out_of_business">Ngừng kinh doanh</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Giá nhập"
          name="cost"
          rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá nhập"
            addonAfter="VNĐ"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => (value ? value.replace(/\D/g, "") : "")}
          />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá bán"
            addonAfter="VNĐ"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => (value ? value.replace(/\D/g, "") : "")}
          />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="stock"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            { pattern: /^[0-9]+$/, message: "Chỉ nhập số" },
          ]}
        >
          <InputNumber placeholder="Nhập số lượng" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Màu sắc"
          name="colors"
          rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
          className="md:col-span-3"
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Nhập màu sắc, nhấn Enter hoặc dấu phẩy để thêm"
            tokenSeparators={[","]}
          />
        </Form.Item>
        <Form.Item
          label={<div>Slug (Tự động)</div>}
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
          className="md:col-span-3"
        >
          <Input placeholder="Slug" disabled />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          className="md:col-span-3"
        >
          <Input.TextArea placeholder="Nhập mô tả sản phẩm" rows={4} />
        </Form.Item>

        <Form.Item
          name="image"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList || [];
          }}
          className="md:col-span-3"
        >
          <Upload
            name="logo"
            listType="picture-card"
            beforeUpload={() => false}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}></Button>
          </Upload>
          {previewImage && (
            <Image
              alt="example"
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
