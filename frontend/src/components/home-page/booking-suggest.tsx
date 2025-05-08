import { ROUTER_PATH } from "@/constant/router-path";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";

export default function BookingSuggest() {
  return (
    <section className="relative bg-blue-600 text-white py-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/images/cta-bg.jpg')` }}
      ></div>
      <div className="relative container mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Sẵn sàng chăm sóc chiếc xe của bạn?
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Đặt lịch bảo dưỡng/sửa chữa dễ dàng, nhanh chóng – chúng tôi sẽ liên
          hệ lại xác nhận ngay!
        </p>
        <CustomLink
          href={ROUTER_PATH.MAINTAIN_REGISTRATION}
          className="bg-white !text-blue-600 font-semibold px-6 py-3 rounded-full text-lg hover:bg-gray-100 transition shadow-md"
        >
          Đặt lịch ngay
        </CustomLink>
      </div>
    </section>
  );
}
