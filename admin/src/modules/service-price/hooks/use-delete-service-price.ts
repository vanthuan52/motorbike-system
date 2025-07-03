import { useCallback, useState } from "react";
import { useAppDispatch } from "@/store";
import { servicePriceActions } from "../store/service-price-slice";
import { ServicePrice } from "../types";

export function useDeleteServicePrice() {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [servicePrice, setServicePrice] = useState<ServicePrice | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = useCallback((price: ServicePrice) => {
    setServicePrice(price);
    setIsVisible(true);
  }, []);

  const handleConfirm = async () => {
    if (!servicePrice) return;
    setLoading(true);
    try {
      dispatch(
        servicePriceActions.deleteServicePrice({
          servicePriceId: servicePrice._id,
        })
      );
    } finally {
      setLoading(false);
      setIsVisible(false);
      setServicePrice(null);
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    setServicePrice(null);
  };

  const confirmModalProps = {
    isVisible,
    title: "Xác nhận xóa",
    message: servicePrice ? "Bạn có chắc muốn xóa giá dịch vụ này không?" : "",
    onConfirm: handleConfirm,
    onCancel: handleCancel,
    confirmText: "Xóa",
    cancelText: "Hủy",
    confirmLoading: loading,
    danger: true,
  };

  return { handleDeleteClick, confirmModalProps };
}
