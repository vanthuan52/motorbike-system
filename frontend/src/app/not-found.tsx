"use client";
import { ROUTER_PATH } from "@/constant/router-path";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-blue-500 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-gray-400 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-5 flex-wrap justify-center items-center">
          <button
            onClick={() => router.back()}
            className="cursor-pointer inline-block bg-white hover:bg-gray-200 text-blue-700  px-6 py-3 rounded-md transition font-bold w-[200px]"
          >
            Go back
          </button>
          <button
            onClick={() => router.push(ROUTER_PATH.HOME)}
            className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition font-bold w-[200px]"
          >
            Take me home
          </button>
        </div>
      </div>
    </div>
  );
}
