import React from "react";
import { Button } from "antd";

type ButtonModalProps = {
  onCancel?: () => void;
  onOk?: () => void;
  cancelText?: string;
  okText?: string;
  loading?: boolean;
  showCancel?: boolean;
};
export const ButtonModal = ({
  onCancel,
  onOk,
  cancelText = "Hủy",
  okText = "Xác nhận",
  loading = false,
  showCancel = true,
}: ButtonModalProps) => {
  return (
    <div className="flex justify-end gap-4">
      {showCancel && (
        <Button
          onClick={onCancel}
          className="!bg-red-500 !text-white hover:!bg-red-600 hover:!border-red-600 !px-5 min-h-[35px] min-w-[150px] !font-medium"
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="primary"
        onClick={onOk}
        loading={loading}
        className="!bg-[#32AE05] !text-white hover:!bg-[#2c8b04] hover:!border-[#2c8b04] !px-5 min-h-[35px] min-w-[150px] !font-medium"
      >
        {okText}
      </Button>
    </div>
  );
};
