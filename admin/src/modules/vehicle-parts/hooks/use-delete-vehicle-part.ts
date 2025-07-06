import { useCallback, useState } from "react";
import { useAppDispatch } from "@/store";
import { vehiclePartActions } from "../store/part-slice";
import { VehiclePart } from "../types";

export function useDeletePart() {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [part, setPart] = useState<VehiclePart | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = useCallback((selectedPart: VehiclePart) => {
    setPart(selectedPart);
    setIsVisible(true);
  }, []);

  const handleConfirm = async () => {
    if (!part) return;
    setLoading(true);
    try {
      dispatch(vehiclePartActions.deletePart({ partId: part._id }));
    } finally {
      setLoading(false);
      setIsVisible(false);
      setPart(null);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setPart(null);
  };

  const confirmModalProps = {
    isVisible,
    title: "Xác nhận xóa",
    message: part ? `Bạn có chắc muốn xóa phụ tùng "${part.name}" không?` : "",
    onConfirm: handleConfirm,
    onCancel: handleCancel,
    confirmText: "Xóa",
    cancelText: "Hủy",
    confirmLoading: loading,
    danger: true,
  };

  return { handleDeleteClick, confirmModalProps };
}
