"use client";

import { useRouter } from "next/navigation";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md text-center">
        <div className="text-red-500 mb-4 flex items-center justify-center">
          <Frown size={64} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập vào trang này.
          <br /> Vui lòng kiểm tra lại tài khoản hoặc quay về trang chủ.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="w-full bg-amber-300 cursor-pointer"
        >
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
}
