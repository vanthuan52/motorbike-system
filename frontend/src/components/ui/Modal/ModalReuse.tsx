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
}

/**
 * A reusable modal component with a title, ok button, and cancel button.
 * The footer buttons are wrapped in a {@link ButtonModal} component.
 *
 * @param {ModalReuseProps} props
 * @param {string} props.title Title to display in the modal header.
 * @param {boolean} props.open Whether the modal is visible.
 * @param {() => void} props.onCancel Called when the cancel button is clicked.
 * @param {() => void} [props.onOk] Called when the ok button is clicked.
 * @param {string} [props.okText="Xác nhận"] Text to display on the ok button.
 * @param {string} [props.cancelText="Hủy"] Text to display on the cancel button.
 * @param {boolean} [props.showCancel=true] Whether to display the cancel button.
 * @param {React.ReactNode} props.children Content to display in the modal body.
 * @param {boolean} [props.loading=false] Whether the ok button is in a loading state.
 */
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
    >
      <div className="!space-y-8">{children}</div>
    </Modal>
  );
};
