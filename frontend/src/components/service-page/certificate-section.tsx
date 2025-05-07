import React from "react";
import { Star, Quote } from "lucide-react";

const certifications = [
  {
    name: "ASE Certified",
    description: "Chứng nhận từ Viện Dịch vụ Ô tô Quốc tế.",
    image: "/images/certificates/ase-certificate.jpg",
  },
  {
    name: "ISO 9001:2015",
    description: "Đạt tiêu chuẩn quản lý chất lượng quốc tế.",
    image: "/images/certificates/iso-9001.png",
  },
];

const testimonials = [
  {
    name: "Nguyễn Văn A",
    comment:
      "Dịch vụ tuyệt vời! Tôi luôn tin tưởng trung tâm khi cần bảo dưỡng xe.",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  },
  {
    name: "Trần Thị B",
    comment: "Thái độ phục vụ chuyên nghiệp và thời gian sửa chữa nhanh chóng.",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const CertificationAndTestimonials = () => {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Chứng Nhận & Đánh Giá
        </h2>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-md"
            >
              <img
                src={cert.image}
                alt={cert.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {cert.name}
                </h3>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Khách Hàng Nói Gì Về Chúng Tôi
        </h3>
        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{testi.name}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-gray-600 italic flex gap-2 items-start">
                <Quote size={18} className="text-indigo-400 mt-1" />
                <p>{testi.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationAndTestimonials;
