import React from "react";
import { motion } from "framer-motion";

type LoadingOverlayProps = {
  show: boolean;
  text?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  text = "Đang tải dữ liệu...",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/70 backdrop-blur-sm">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-white text-lg font-medium">{text}</p>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;
