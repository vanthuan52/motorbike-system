import { Card, Form, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { useAppDispatch } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { User } from "@/modules/user/types";
import "./index.css";

interface AvatarUploadSectionProps {
  mode: ENUM_PAGE_MODE;
  customer?: User | null;
  fileList: UploadFile[];
  onUpload: (file: UploadFile | string) => void;
  onRemove: () => void;
}

const AvatarUploadSection = ({
  mode,
  fileList,
  onUpload,
  onRemove,
}: AvatarUploadSectionProps) => {
  const dispatch = useAppDispatch();

  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      dispatch(
        notificationActions.notify({
          type: "error",
          message: "Chỉ được phép sử dụng hình ảnh",
        })
      );
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      dispatch(
        notificationActions.notify({
          type: "error",
          message: "Kích thước ảnh không được vượt quá 2MB.",
        })
      );
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handlePreview = (file: UploadFile) => {
    let imageUrl = file.url;
    if (!imageUrl && file.originFileObj) {
      imageUrl = URL.createObjectURL(file.originFileObj as Blob);
    }

    if (imageUrl) {
      window.open(imageUrl, "_blank");
    } else {
      dispatch(
        notificationActions.notify({
          type: "error",
          message: "Không tìm thấy ảnh.",
        })
      );
    }
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    if (newFileList.length > 0) {
      const latestFile = newFileList[0];
      if (latestFile.originFileObj) {
        onUpload(latestFile);
      } else if (latestFile.url) {
        onUpload(latestFile.url);
      }
    } else {
      onRemove();
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Card>
      <Form.Item name="photo" className="">
        <div
          className="relative w-full aspect-square flex items-center justify-center cursor-pointer"
          onClick={() => document.getElementById("avatar-input")?.click()}
        >
          <Upload
            name="photo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={true}
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
            disabled={isDisabled}
            onRemove={() => {
              onRemove();
              return true;
            }}
            onPreview={handlePreview}
          >
            {fileList.length === 0 && !isDisabled ? uploadButton : null}
          </Upload>
        </div>
        <p className="text-center text-sm text-gray-500 !mt-2">
          Click on image to change
        </p>
      </Form.Item>
    </Card>
  );
};

export default AvatarUploadSection;

/*
<Form.Item name="photo" className="">
  <div
    className="relative w-full aspect-square rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden"
    onClick={() => document.getElementById("avatar-input")?.click()}
  >
    {fileList.length === 0 ? (
      <span className="text-gray-400 text-sm">Nhấp để thêm ảnh</span>
    ) : (
      <img
        src={
          typeof fileList[0] === "string"
            ? fileList[0]
            : URL.createObjectURL(fileList[0])
        }
        alt="avatar"
        className="w-full h-full object-cover"
      />
    )}
    <input
      type="file"
      id="avatar-input"
      hidden
      accept="image/*"
      onChange={handleFileChange}
    />
  </div>
  <p className="text-center text-sm text-gray-500 !mt-2">
    Click on image to change
  </p>
</Form.Item>
*/
