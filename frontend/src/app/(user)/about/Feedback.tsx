function AboutFeedback() {
  return (
    <>
      <section className="space-y-8">
        <h2 className="text-4xl font-semibold text-center">Khách Hàng Nói Gì</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="relative bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition"
            >
              <div className="absolute top-4 left-4 text-orange-200 text-6xl">“</div>
              <p className="italic text-gray-600 leading-relaxed mb-6">
                Dịch vụ quá tuyệt vời, nhanh chóng và chuyên nghiệp. Tôi sẽ tiếp tục sử dụng dịch vụ tại đây.
              </p>
              <p className="font-semibold">Trần Thị A</p>
              <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutFeedback;