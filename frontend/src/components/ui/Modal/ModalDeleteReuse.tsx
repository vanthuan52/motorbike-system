import { Modal } from "antd";
import React from "react";
import { ButtonModal } from "./ButtonModal";

type ModalDeleteReuseProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

/**
 * A modal component for confirming deletion actions, typically used for deleting a vehicle company.
 *
 * @param {boolean} open - Determines if the modal is visible.
 * @param {() => void} onCancel - Function to call when the cancel button is clicked.
 * @param {() => void} onConfirm - Function to call when the confirm button is clicked.
 * @param {string} [title="Xóa hãng xe"] - The title of the modal.
 * @param {string} [description="Bạn có chắc muốn xóa hãng xe này ?"] - The description displayed in the modal.
 */

export const ModalDeleteReuse = ({
  open,
  onCancel,
  onConfirm,
  title = "Xóa hãng xe",
  description = "Bạn có chắc muốn xóa hãng xe này ?",
}: ModalDeleteReuseProps) => {
  return (
    <Modal
      title={<span className="text-lg font-semibold">{title}</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      closable={false}
      width={500}
      height={300}
    >
      <p className="my-4 text-center text-lg font-semibold mt-8">
        {description}
      </p>
      <ButtonModal
        onCancel={onCancel}
        onOk={onConfirm}
        cancelText="Hủy"
        okText="Xác nhận"
      />
    </Modal>
  );
};
