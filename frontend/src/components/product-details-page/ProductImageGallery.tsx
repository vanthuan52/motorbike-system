import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { Image } from "antd";
import React, { useState } from "react";
import type { Swiper as SwiperType } from "swiper";

interface ProductImageGalleryProps {
    images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    return (
        <div className="flex flex-col items-center w-full lg:w-1/2">
            <Swiper
                spaceBetween={0}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="mb-4"
                style={{ width: "100%", maxWidth: 900 }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <div className="aspect-[16/13] w-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                            <Image
                                src={img}
                                alt={`Ảnh ${idx + 1}`}
                                className="object-contain w-full h-full"
                                preview={false}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={20}
                slidesPerView={images.length}
                watchSlidesProgress
                modules={[Thumbs]}
                style={{ width: "100%", maxWidth: 900, height: 130 }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}  >
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden gap-4">
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="object-contain cursor-pointer rounded-2xl w-full h-full "
                                preview={false}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}