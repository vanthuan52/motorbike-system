import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  let title = "Đã có lỗi xảy ra 😥";
  let message = "Xin lỗi vì sự cố không mong muốn. Vui lòng thử lại sau.";

  if (isRouteErrorResponse(error)) {
    title = `Lỗi ${error.status}`;
    message = error.statusText || "Có sự cố xảy ra khi tải trang.";
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center bg-white shadow-xl rounded-2xl p-8"
      >
        {/* Illustration */}
        <div className="mb-6">
          <img
            src="images/error-icon.png"
            alt="Error illustration"
            className="w-40 mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white! shadow transition"
          >
            <Home size={18} />
            Về trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );
}
