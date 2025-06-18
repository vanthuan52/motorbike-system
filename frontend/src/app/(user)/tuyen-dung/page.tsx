import { Metadata } from "next";
import CareerPage from "./_components/CareerPage";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description: "Trang tuyển dụng của chúng tôi",
};
export default function page() {
  return (
    <div className="w-full">
      <CareerPage />
    </div>
  );
}
