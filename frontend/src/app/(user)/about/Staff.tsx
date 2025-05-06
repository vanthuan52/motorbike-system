import Image from "next/image";

function AboutStaff() {
  return (
    <>
      <section className="space-y-8">
        <h2 className="text-4xl font-semibold text-center">Đội Ngũ Kỹ Thuật Viên</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition"
            >
              <div className="relative w-full h-56 mb-6 rounded-xl overflow-hidden">
                <Image
                  src="/images/blog-img.png"
                  alt={`Kỹ thuật viên ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <p className="text-xl font-semibold mb-1">Nguyễn Văn {idx + 1}</p>
              <p className="text-sm text-gray-500 mb-4">Kỹ thuật viên</p>
              <button className="text-orange-500 hover:underline text-sm font-medium">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default AboutStaff;