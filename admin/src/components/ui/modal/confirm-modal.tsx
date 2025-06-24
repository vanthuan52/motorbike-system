import React from "react";
import { Button } from "antd";

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  danger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmLoading = false,
  danger = false,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 mx-auto transform transition-all duration-300 scale-100 opacity-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-sm text-gray-600 mb-6">{message}</div>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} disabled={confirmLoading}>
            {cancelText}
          </Button>
          <Button
            type={danger ? "primary" : "default"}
            danger={danger}
            loading={confirmLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
