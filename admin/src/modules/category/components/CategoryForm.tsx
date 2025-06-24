import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Form, Input, Select, Button, Upload, Divider } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { Category, ENUM_PART_TYPE_STATUS } from "../types";
import { mockDataTableVehicleCompany } from "@/modules/vehicle-company/mocks/vehicle-company";
import { GreenSwitch } from "@/components/ui/switch";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import ImagePreviewModal from "@/components/image-preview-modal";

const CategoryForm = ({
  initialValues,
  onSubmit,
  loading = false,
  mode = ENUM_PAGE_MODE.EDIT,
  fileList,
  setFileList,
}: {
  initialValues?: Category | null;
  onSubmit: (values: Category) => void;
  loading?: boolean;
  mode?: ENUM_PAGE_MODE;
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[]) => void;
}) => {
  const [form] = Form.useForm();
  const [selectedFileForPreview, setSelectedFileForPreview] =
    useState<UploadFile | null>(null);
  const navigate = useNavigate();
  const isEditable = mode === ENUM_PAGE_MODE.EDIT;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status === ENUM_PART_TYPE_STATUS.ACTIVE,
      });
      if (initialValues.photo && Array.isArray(initialValues.photo)) {
        setFileList(
          initialValues.photo.map((img, idx) => ({
            uid: String(-idx - 1),
            name: `photo-${idx}.jpg`,
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

  const handleValuesChange = (changed: Record<string, unknown>) => {
    if ("name" in changed) {
      form.setFieldsValue({ slug: slugify(changed.name as string) });
    }
  };

  const handlePreview = async (file: UploadFile) => {
    setSelectedFileForPreview(file);
  };

  const handleClosePreview = () => {
    setSelectedFileForPreview(null);
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
      const category: Category = {
        _id: initialValues?._id ?? "",
        name: values.name,
        vehicle_company_id: values.vehicle_company_id,
        description: values.description,
        slug: values.slug,
        status: values.status
          ? ENUM_PART_TYPE_STATUS.ACTIVE
          : ENUM_PART_TYPE_STATUS.INACTIVE,
        // photo: imageUrls.filter(
        //     (url): url is string => typeof url === "string"
        // ),
        photo: "",
      };
      onSubmit(category);
    } catch {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };
  return (
    <div className="sm:px-4 mt-10 mb-3 sm:mt-10 sm:mb-3 lg:my-8 mx-4 bg-white rounded-xl shadow p-6">
      <div className="flex gap-2 items-center mb-2 w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ?? undefined}
        autoComplete="off"
        onValuesChange={handleValuesChange}
      >
        <Divider orientation="left">Thông tin cơ bản</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" size="large" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Slug không được để trống" }]}
          >
            <Input placeholder="Slug" size="large" readOnly />
          </Form.Item>
          <Form.Item
            label="Hãng xe"
            name="vehicle_company_id"
            rules={[{ required: true, message: "Vui lòng chọn hãng xe" }]}
          >
            <Select placeholder="Chọn hãng xe" size="large">
              {mockDataTableVehicleCompany.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            valuePropName="checked"
          >
            <GreenSwitch />
          </Form.Item>
        </div>
        <Divider orientation="left">Hình ảnh</Divider>
        <Form.Item
          name="image"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList || [])}
        >
          <Upload
            name="logo"
            listType="picture-card"
            beforeUpload={() => false}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            multiple
            style={{ width: "100%" }}
            className="w-full"
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} />
          </Upload>
          <ImagePreviewModal
            fileToPreview={selectedFileForPreview}
            onClose={handleClosePreview}
          />
        </Form.Item>
        <Divider orientation="left">Thông tin khác</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item label="Mô tả" name="description" className="md:col-span-2">
            <Input.TextArea rows={2} placeholder="Nhập mô tả" size="large" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2 w-full mt-4">
          <Button
            type="primary"
            icon={isEditable ? <SaveOutlined /> : <PlusOutlined />}
            onClick={handleFinish}
            loading={loading}
          >
            {isEditable ? "Lưu" : "Tạo mới"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryForm;
