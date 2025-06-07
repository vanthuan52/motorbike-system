import { Image } from "antd";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Swiper as SwiperType } from "swiper";
import { IMG_PLACEHOLDER } from "@/constants/application";
export default function ProductImageGallery({ images }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  return (
    <>
      <Swiper
        spaceBetween={10}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[Thumbs]}
        className="mb-4"
        style={{ width: "100%", maxWidth: 800 }}
      >
        {images.map((img: string, idx: number) => (
          <SwiperSlide key={idx}>
            <div className="aspect-[16/12] w-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={img}
                alt={`Ảnh ${idx + 1}`}
                className="object-contain w-full h-full"
                fallback={IMG_PLACEHOLDER}
                preview={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={Math.min(images.length, 5)}
        watchSlidesProgress
        modules={[Thumbs]}
        style={{ width: "100%", maxWidth: 300, height: 100 }}
        className="mt-2"
      >
        {images.map((img: string, idx: number) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="object-contain cursor-pointer rounded-2xl w-full h-full"
                fallback={IMG_PLACEHOLDER}
                preview={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
