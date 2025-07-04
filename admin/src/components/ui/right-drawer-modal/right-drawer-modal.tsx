import { FC, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./right-drawer-modal.module.scss";

interface RightDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
}

const RightDrawerModal: FC<RightDrawerModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Chi tiết",
  width = "400px",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (modalRef.current && !modalRef.current.contains(target)) {
        if (
          target.closest(".ant-select-dropdown") ||
          target.closest(".ant-picker-dropdown")
        ) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>
      <div
        className={styles.modalContent}
        style={{ width: width }}
        ref={modalRef}
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

export default RightDrawerModal;
