"use client";

import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnails — left column */}
      <div className="hidden sm:flex flex-col gap-3 w-24 flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={`
              group aspect-square w-full rounded-lg overflow-hidden border-2
              transition-all duration-300 cursor-pointer
              ${
                selectedIndex === idx
                  ? "border-primary-500"
                  : "border-transparent hover:border-primary-300"
              }
            `}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 min-w-0">
        <div className="group aspect-square w-full overflow-hidden cursor-zoom-in rounded-2xl">
          <img
            src={images[selectedIndex]}
            alt={`Ảnh sản phẩm ${selectedIndex + 1}`}
            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Mobile thumbnails — horizontal scroll */}
        <div className="flex sm:hidden gap-2.5 mt-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`
                flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200
                ${
                  selectedIndex === idx
                    ? "border-primary-500"
                    : "border-transparent hover:border-primary-300"
                }
              `}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
