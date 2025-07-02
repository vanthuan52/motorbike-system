import { useState } from "react";
import { Card, Form, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { useAppDispatch } from "@/store";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { User } from "@/modules/user/types";
import ImagePreviewModal from "@/components/image-preview-modal";

interface PhotoUploadSectionProps {
  mode: ENUM_PAGE_MODE;
  customer?: User | null;
  fileList: UploadFile[];
  onUpload: (file: UploadFile | string) => void;
  onRemove: () => void;
}

const PhotoUploadSection = ({
  mode,
  fileList,
  onUpload,
  onRemove,
}: PhotoUploadSectionProps) => {
  const dispatch = useAppDispatch();
  const [selectedFileForPreview, setSelectedFileForPreview] =
    useState<UploadFile | null>(null);

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

  const handlePreview = async (file: UploadFile) => {
    setSelectedFileForPreview(file);
  };

  const handleClosePreview = () => {
    setSelectedFileForPreview(null);
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
      <h2 className="text-lg font-semibold mb-4">Hình ảnh hãng xe</h2>
      <Form.Item name="photo">
        <div className="flex gap-2 flex-col">
          <div
            className="relative w-full min-h-[102px] flex items-center justify-center mt-4"
            onClick={() => document.getElementById("Photo-input")?.click()}
          >
            <Upload
              name="photo"
              listType="picture-card"
              className="Photo-uploader"
              showUploadList={true}
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onPreview={handlePreview}
              disabled={isDisabled}
              onRemove={() => {
                onRemove();
                return true;
              }}
              multiple
            >
              {fileList.length === 0 && !isDisabled ? uploadButton : null}
            </Upload>
            <ImagePreviewModal
              fileToPreview={selectedFileForPreview}
              onClose={handleClosePreview}
            />
          </div>
          <p className="text-center text-sm text-gray-500">
            Click on image to change
          </p>
        </div>
      </Form.Item>
    </Card>
  );
};

export default PhotoUploadSection;
