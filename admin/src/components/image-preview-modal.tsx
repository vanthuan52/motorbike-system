import React, { useState, useEffect } from "react";
import { Image } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { imageHelper } from "@/utils/image.helper";

interface ImagePreviewModalProps {
  fileToPreview: UploadFile | string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  fileToPreview,
  onClose,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentPreviewImage, setCurrentPreviewImage] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const generatePreview = async () => {
      if (!fileToPreview) {
        setPreviewOpen(false);
        setCurrentPreviewImage(undefined);
        return;
      }

      let imageUrl: string | undefined;

      if (typeof fileToPreview === "string") {
        imageUrl = fileToPreview;
      } else {
        if (fileToPreview.url) {
          imageUrl = fileToPreview.url;
        } else if (fileToPreview.preview) {
          imageUrl = fileToPreview.preview;
        } else if (fileToPreview.originFileObj) {
          try {
            imageUrl = await imageHelper.getBase64(fileToPreview.originFileObj);
          } catch (error) {
            console.error("Error generating base64 preview:", error);
            imageUrl = undefined;
          }
        }
      }

      setCurrentPreviewImage(imageUrl);
      setPreviewOpen(!!imageUrl);
    };

    generatePreview();
  }, [fileToPreview]);

  const handleVisibleChange = (visible: boolean) => {
    if (!visible) {
      setPreviewOpen(false);
      setCurrentPreviewImage(undefined);
      onClose();
    }
  };

  return (
    <>
      {currentPreviewImage && (
        <Image
          alt="Preview"
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: handleVisibleChange,
            afterOpenChange: (visible) =>
              !visible && setCurrentPreviewImage(undefined),
          }}
          src={currentPreviewImage}
        />
      )}
    </>
  );
};

export default ImagePreviewModal;
