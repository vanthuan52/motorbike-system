"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/section-heading";

const galleryImages = [
  // Hàng 1 & 2 (Bento Mẫu)
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop",
    className:
      "md:col-span-2 md:row-span-2 h-[300px] sm:h-[400px] md:h-[600px]",
    alt: "Khu vực bảo dưỡng và sửa chữa chính",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Kiểm tra động cơ chuyên sâu",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Đội ngũ thợ tay nghề cao",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Bảo dưỡng chi tiết dàn áo",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Thay thế lốp và phụ tùng chuẩn",
  },
  // Hàng 3 & 4 (Bento Mẫu 2 - Đảo ngược)
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Khu vực trưng bày phụ kiện",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Chăm sóc xích và truyền động",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop",
    className:
      "md:col-span-2 md:row-span-2 h-[300px] sm:h-[400px] md:h-[600px]",
    alt: "Dịch vụ thay nhớt nhập khẩu cao cấp",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Kiểm tra hệ thống điện",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    className: "col-span-1 row-span-1 h-[250px] sm:h-[300px] md:h-[288px]",
    alt: "Hoàn thiện và đánh bóng",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-surface py-20 relative overflow-hidden" id="gallery">
      {/* Decorative Blur blob */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary-100/30 rounded-full mix-blend-multiply blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <SectionHeading
          title="Không Gian Thực Tế Cửa Hàng"
          subtitle="Trải nghiệm trực quan về không gian làm việc chuyên nghiệp, trang thiết bị hiện đại và đội ngũ kỹ thuật tận tâm tại hệ thống của chúng tôi."
          className="mb-16"
        />

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((img, idx) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-3xl shadow-lg group ${img.className}`}
            >
              {/* Overlay Gradient (Always slightly visible to let text pop, gets darker on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-10 pointer-events-none" />

              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 pointer-events-none">
                <span className="text-white font-semibold text-lg md:text-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-md">
                  {img.alt}
                </span>
                {/* Decorative short line */}
                <span className="h-1 w-8 bg-primary-500 rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
