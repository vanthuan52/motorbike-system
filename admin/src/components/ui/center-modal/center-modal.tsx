import { FC, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./center-modal.module.scss";

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const CenterModal: FC<CenterModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Chi tiết",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>
      <div
        className={styles.modalContent}
        ref={modalRef}
        onClick={(e) => {
          e.stopPropagation();
          const target = e.target as HTMLElement;
          if (
            target.closest(".ant-select-dropdown") ||
            target.closest(".ant-picker-dropdown") ||
            target.closest(".ant-modal-mask")
          ) {
          }
        }}
      >
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default CenterModal;
