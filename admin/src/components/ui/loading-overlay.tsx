import React from "react";
import { motion } from "framer-motion";

type LoadingOverlayProps = {
  show: boolean;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-lg font-medium">Đang tải dữ liệu...</p>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;
