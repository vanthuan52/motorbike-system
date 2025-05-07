interface Testimonial {
  name: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Nguyễn Văn A",
    content:
      "Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp. Xe của tôi chạy êm hơn hẳn sau khi bảo dưỡng!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Trần Thị B",
    content:
      "Mình rất hài lòng với combo bảo dưỡng toàn diện, giá hợp lý và thời gian nhanh chóng.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Lê Văn C",
    content:
      "Trung tâm làm việc rất minh bạch, báo giá rõ ràng. Mình sẽ quay lại thường xuyên!",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Phạm Thùy D",
    content:
      "Ưu đãi lần đầu thật hấp dẫn! Mình được giảm giá và tư vấn tận tình.",
    avatar: "https://randomuser.me/api/portraits/women/51.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Khách hàng nói gì về chúng tôi?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover "
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {t.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{t.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
