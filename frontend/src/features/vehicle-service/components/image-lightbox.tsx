"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  alt?: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  alt = "",
}: ImageLightboxProps) {
  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative z-10 max-w-[90vw] max-h-[85vh] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <img
                src={images[currentIndex]}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
                aria-label="Ảnh tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === currentIndex
                      ? "border-white scale-110 shadow-lg"
                      : "border-white/30 opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small trigger icon to overlay on images */
export function ZoomTrigger() {
  return (
    <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <ZoomIn className="w-4 h-4" />
    </div>
  );
}
