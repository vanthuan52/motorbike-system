"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";

import { cartActions } from "@/features/cart/store";
import { IMG_PLACEHOLDER } from "@/constant/application";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { Product } from "@/types/users/products/product";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export default function ProductCard({
  product,
  layout = "grid",
}: ProductCardProps) {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT);
  const imgSrc = Array.isArray(product.image)
    ? product.image[0]
    : product.image;
  const isList = layout === "list";
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      cartActions.addToCart({
        productId: product.id,
        color: product.colors[0],
        quantity: 1,
      }),
    );
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = IMG_PLACEHOLDER;
  };

  // ─── LIST LAYOUT ────────────────────────────────────────────
  if (isList) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween" as const, duration: 0.3 }}
        className="group relative flex flex-col min-[500px]:flex-row gap-4 min-[500px]:gap-5
                   rounded-xl bg-surface p-3 min-[500px]:p-4 shadow-xs
                   hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* Image */}
        <Link
          href={`/phu-tung/${product.slug}`}
          className="relative w-full min-[500px]:w-40 min-[500px]:h-40 aspect-[4/3] min-[500px]:aspect-auto
                     flex-shrink-0 overflow-hidden rounded-lg bg-bg-soft"
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImgError}
            className="w-full h-full object-cover transition-transform duration-500
              group-hover:scale-105"
          />
          {/* Discount badge */}
          {product.discount && product.discount > 0 && (
            <span
              className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md
                text-xs font-bold bg-error text-white"
            >
              -{product.discount}%
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Link href={`/phu-tung/${product.slug}`} className="group/link">
            <h4
              className="text-sm min-[500px]:text-base font-semibold text-text-primary mb-1 line-clamp-2
                           group-hover/link:text-primary-500 transition-colors duration-200"
            >
              {product.name}
            </h4>
          </Link>

          <p className="text-sm text-text-muted line-clamp-2 mb-3 leading-relaxed hidden min-[500px]:block">
            {product.description}
          </p>

          {/* Price & Actions */}
          <div className="mt-auto flex items-center justify-between gap-3">
            <p className="text-lg font-bold text-text-primary">
              {product.price.toLocaleString()}
              <span className="text-sm font-medium ml-0.5">₫</span>
            </p>
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                         rounded-lg bg-primary-500 text-white
                         hover:bg-primary-600
                         transition-all duration-200"
            >
              <ShoppingCart size={14} />
              {t("productCard.addToCart")}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── GRID LAYOUT ────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween" as const, duration: 0.35 }}
      className="group relative flex flex-col rounded-xl bg-surface
                 shadow-xs overflow-hidden
                 hover:shadow-lg transition-all duration-300"
    >
      {/* ── Image section ── */}
      <Link
        href={`/phu-tung/${product.slug}`}
        className="relative w-full aspect-[4/3] overflow-hidden bg-bg-soft"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-500
            group-hover:scale-105"
        />

        {/* Discount badge — top-left */}
        {product.discount && product.discount > 0 && (
          <span
            className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md
              text-xs font-bold bg-error text-white"
          >
            -{product.discount}%
          </span>
        )}
      </Link>

      {/* ── Content section ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Product name */}
        <Link href={`/phu-tung/${product.slug}`} className="group/link mb-1">
          <h4
            className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug
                       group-hover/link:text-primary-500 transition-colors duration-200"
          >
            {product.name}
          </h4>
        </Link>

        {/* Price */}
        <p className="text-lg font-bold text-text-primary mt-auto mb-3">
          {product.price.toLocaleString()}
          <span className="text-sm font-medium ml-0.5">₫</span>
        </p>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className="w-full inline-flex items-center justify-center gap-1.5
                     py-2 text-sm font-medium rounded-lg
                     bg-primary-500 text-white
                     hover:bg-primary-600
                     transition-all duration-200"
        >
          <ShoppingCart size={14} />
          {t("productCard.addToCart")}
        </button>
      </div>
    </motion.div>
  );
}
