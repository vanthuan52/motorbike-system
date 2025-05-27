import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import React from "react";

const communityActivities = [
  {
    title: "Chương trình bảo dưỡng miễn phí cho xe cứu thương",
    description:
      "Trung tâm đồng hành cùng y tế tuyến đầu trong mùa dịch COVID-19.",
    image: "/images/about/community-1.png",
  },
  {
    title: "Tài trợ học bổng kỹ thuật viên trẻ",
    description:
      "Hỗ trợ đào tạo và cấp học bổng cho sinh viên ngành sửa chữa ô tô - xe máy.",
    image: "/images/about/community-2.jpg",
  },
];

const SocialCommunitySection = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
          Theo Dõi Chúng Tôi
        </h2>
        <div className="flex justify-center gap-6 mb-16">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-3xl hover:scale-110 transition-transform"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-pink-500 text-3xl hover:scale-110 transition-transform"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="text-red-600 text-3xl hover:scale-110 transition-transform"
          >
            <FaYoutube />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="text-black text-3xl hover:scale-110 transition-transform"
          >
            <FaTiktok />
          </a>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Hoạt Động Cộng Đồng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {communityActivities.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl shadow-md overflow-hidden bg-gray-50 hover:shadow-xl transition-shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialCommunitySection;
