import { Modal } from "antd";
import React from "react";
import { ButtonModal } from "./ButtonModal";

interface ModalReuseProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  children: React.ReactNode;
  loading?: boolean;
  width?: number;
}

export const ModalReuse = ({
  title,
  open,
  onCancel,
  onOk,
  okText = "Xác nhận",
  cancelText = "Hủy",
  showCancel = true,
  children,
  loading = false,
  width = 500,
}: ModalReuseProps) => {
  return (
    <Modal
      title={<span className="text-lg font-semibold">{title}</span>}
      open={open}
      onCancel={onCancel}
      closeIcon={false}
      footer={
        <ButtonModal
          onCancel={onCancel}
          onOk={onOk}
          loading={loading}
          cancelText={cancelText}
          okText={okText}
          showCancel={showCancel}
        />
      }
      centered
      destroyOnClose
      width={width}
    >
      <div className="!space-y-8">{children}</div>
    </Modal>
  );
};
