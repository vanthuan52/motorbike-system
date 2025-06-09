import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  GetProp,
  Upload,
  Image,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import {
  SaveOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { Product } from "../types";
import { getBase64 } from "@/modules/vehicle-parts/utils/fillUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { statusMap } from "../constant";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  mode = "edit",
  fileList,
  setFileList,
}: {
  initialValues?: Product | null;
  onSubmit: (values: Product) => void;
  onCancel?: () => void;
  loading?: boolean;
  mode?: "edit" | "create";
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[]) => void;
}) {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        colors: initialValues.colors || [],
      });
      if (initialValues.image && Array.isArray(initialValues.image)) {
        setFileList(
          initialValues.image.map((img, idx) => ({
            uid: String(-idx - 1),
            name: `image-${idx}.jpg`,
            status: "done",
            url: img.startsWith("/") ? img : "/" + img,
          }))
        );
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialValues, form, setFileList]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const imageUrls =
        fileList && fileList.length > 0
          ? fileList.map((file: UploadFile) => file.url || file.thumbUrl)
          : [];
      const product: Product = {
        id: initialValues?.id ?? "",
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
    <div className="sm:px-4 mt-10 mb-3 sm:mt-10 sm:mb-3 lg:my-8 mx-4 bg-white rounded-xl shadow p-6">
      <div className="flex gap-2 items-center mb-2 w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
      <div className="sm:text-2xl font-bold flex-1 mb-4">
        {mode === "edit" ? "Chỉnh sửa sản phẩm" : "Tạo mới sản phẩm"}
        {mode === "edit" && (
          <span className="text-gray-500"> {initialValues?.name}</span>
        )}
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ?? undefined}
        autoComplete="off"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-8"
      >
        <Form.Item
          name="image"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList || [])}
          className="sm:col-span-2 md:col-span-1 w-full max-h-[400px] sm:max-h-[600px] overflow-auto"
        >
          <Upload
            name="logo"
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            multiple
            style={{ width: "100%" }}
            className="w-full"
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
          </Upload>
          {previewImage && (
            <Image
              alt="preview"
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
        <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          <Form.Item
            label="Mã sản phẩm"
            name="sku"
            rules={[{ required: true, message: "Vui lòng nhập SKU" }]}
            className="md:col-span-1"
          >
            <Input placeholder="Nhập mã sản phẩm" size="large" />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            className="md:col-span-1"
          >
            <Input placeholder="Nhập tên sản phẩm" size="large" />
          </Form.Item>
          <Form.Item
            label="Hãng"
            name="brand_id"
            rules={[{ required: true, message: "Vui lòng nhập hãng" }]}
            className="md:col-span-1"
          >
            <Input placeholder="Nhập hãng" size="large" />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category_id"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            className="md:col-span-1"
          >
            <Select placeholder="Chọn danh mục" size="large">
              {mockDataTableVehiclePart.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Giá Nhập"
            name="cost"
            rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
            className="md:col-span-1"
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá nhập"
              addonAfter="VNĐ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => (value ? value.replace(/\D/g, "") : "")}
              size="large"
            />
          </Form.Item>
          <Form.Item
            label="Giá Bán"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
            className="md:col-span-1"
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá bán"
              addonAfter="VNĐ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => (value ? value.replace(/\D/g, "") : "")}
              size="large"
            />
          </Form.Item>
          <Form.Item
            label="Tồn kho"
            name="stock"
            rules={[
              {
                required: true,
                type: "number",
                min: 0,
                message: "Vui lòng nhập tồn kho và >= 0",
              },
            ]}
            className="md:col-span-1"
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Nhập tồn kho"
              size="large"
            />
          </Form.Item>
          <Form.Item label="Xuất xứ" name="origin" className="md:col-span-1">
            <Input placeholder="Nhập xuất xứ" size="large" />
          </Form.Item>
          <Form.Item
            label="Tình trạng"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
            className="md:col-span-1"
          >
            <Select placeholder="Chọn tình trạng" size="large">
              {Object.entries(statusMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Màu sắc" name="colors" className="md:col-span-1">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Nhập màu, Enter để thêm"
              size="large"
            />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" className="md:col-span-2">
            <Input.TextArea rows={2} placeholder="Nhập mô tả" size="large" />
          </Form.Item>
        </div>
        <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 w-full">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleFinish}
            loading={loading}
          >
            {mode === "edit" ? "Lưu" : "Tạo mới"}
          </Button>
          {mode === "edit" && (
            <Button
              icon={<CloseOutlined />}
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
