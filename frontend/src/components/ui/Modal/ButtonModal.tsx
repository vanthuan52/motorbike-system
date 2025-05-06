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

/**
 * A modal component containing two buttons: one for canceling and one for confirming actions.
 *
 * @param {() => void} [onCancel] - Function to call when the cancel button is clicked.
 * @param {() => void} [onOk] - Function to call when the confirm button is clicked.
 * @param {string} [cancelText="Hủy"] - Text to display on the cancel button.
 * @param {string} [okText="Xác nhận"] - Text to display on the confirm button.
 * @param {boolean} [loading=false] - Whether the confirm button shows a loading spinner.
 * @param {boolean} [showCancel=true] - Whether to display the cancel button.
 */

export const ButtonModal = ({
  onCancel,
  onOk,
  cancelText = "Hủy",
  okText = "Xác nhận",
  loading = false,
  showCancel = true,
}: ButtonModalProps) => {
  return (
    <div className="flex justify-center gap-4">
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
