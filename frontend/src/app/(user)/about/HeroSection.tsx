import Image from "next/image";

function AboutHeroSection() {
  return (
    <>
      <section className="relative text-center py-32 rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/blog-img.png"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            quality={80}
          />
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold text-white mb-6">
            Về Chúng Tôi
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Nơi bạn và chiếc xe của bạn được chăm sóc tận tình bởi đội ngũ kỹ thuật viên giàu kinh nghiệm.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition">
            Liên hệ ngay
          </button>
        </div>
      </section>
    </>
  );
}

export default AboutHeroSection;