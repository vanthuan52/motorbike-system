import { Metadata } from "next";
import CareerDetailsPage from "./_components/CareerDetailsPage";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description: "Trang tuyển dụng của chúng tôi",
};
export default function page() {
  return (
    <div className="w-full">
      <CareerDetailsPage />
    </div>
  );
}
