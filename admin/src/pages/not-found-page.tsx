import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-9xl font-extrabold text-white mb-4 drop-shadow-lg">
          404
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-500 transition rounded-lg text-lg font-medium shadow-lg mt-6"
        >
          Quay lại trang chủ
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
