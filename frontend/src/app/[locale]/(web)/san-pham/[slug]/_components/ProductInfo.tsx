import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Heart, Minus, Plus, Share2, ShieldCheck, Truck, RefreshCcw, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { Product } from "@/types/users/products/product";
import { mockDataTableVehiclePart } from "@/data/TableData";
import { addToCart } from "@/features/cart/store/cart-slice";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT_DETAIL);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, color: product.colors[selectedColor], quantity }));
    toast.success(t("productInfo.toast.success"));
  };

  const categoryName = product.partTypeId
    ? mockDataTableVehiclePart.find((cat) => cat.id === product.partTypeId)?.name
    : t("productInfo.category.unknown");

  const statusConfig = {
    in_stock: { label: t("productInfo.inStock"), class: "bg-success-bg text-success" },
    out_of_stock: { label: t("productInfo.outOfStock"), class: "bg-warning-bg text-warning" },
    out_of_business: { label: t("productInfo.outOfBusiness"), class: "bg-secondary-200 text-text-muted" },
  };

  const status = statusConfig[product.status];

  return (
    <div className="flex-1 flex flex-col gap-6 lg:py-2">
      {/* Header: Name + Status */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.class}`}>
            {status.label}
          </span>
          <span className="text-text-muted text-xs font-medium">
            {t("productInfo.sku")}: {product.sku}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {categoryName && (
          <span className="px-3 py-1 rounded-md text-xs bg-primary-50 text-primary-500 font-medium">
            {categoryName}
          </span>
        )}
        <span className="px-3 py-1 rounded-md text-xs bg-bg-soft text-text-secondary font-medium">
          {t("productInfo.origin")}: {product.origin}
        </span>
        <span className="px-3 py-1 rounded-md text-xs bg-bg-soft text-text-secondary font-medium">
          {t("productInfo.stock")}: {product.stock}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-extrabold text-primary-500">
          {product.price.toLocaleString("vi-VN")}₫
        </span>
        {product.discount && (
          <span className="text-sm font-semibold text-white bg-error px-2 py-0.5 rounded-md">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="border-border" />

      {/* Color Picker */}
      <div className="flex flex-col gap-2.5">
        <span className="text-sm text-text-primary font-medium">
          {t("productInfo.color")}
        </span>
        <div className="flex gap-2.5">
          {product.colors.map((color, idx) => (
            <button
              key={color + idx}
              type="button"
              onClick={() => setSelectedColor(idx)}
              className={`
                w-9 h-9 rounded-full transition-all duration-200 cursor-pointer
                ${
                  selectedColor === idx
                    ? "ring-2 ring-primary-500 ring-offset-2 scale-110"
                    : "ring-1 ring-border-strong hover:ring-primary-300 hover:scale-105"
                }
              `}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Quantity + CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity control */}
        <div className="flex items-center">
          <span className="text-sm text-text-primary font-medium mr-3 whitespace-nowrap">
            {t("productInfo.quantity")}
          </span>
          <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-base font-semibold text-text-primary select-none">
              {quantity}
            </span>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          className={`
            flex-1 sm:flex-none sm:min-w-[200px] h-11 px-6 font-semibold text-sm rounded-lg
            transition-all duration-200 flex items-center justify-center gap-2
            ${
              product.status !== "in_stock"
                ? "bg-secondary-200 text-text-disabled cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 cursor-pointer shadow-sm hover:shadow-md"
            }
          `}
          onClick={handleAddToCart}
          disabled={product.status !== "in_stock"}
        >
          {product.status === "in_stock"
            ? t("productInfo.addToCart")
            : t("productInfo.outOfStock")}
        </button>

        {/* Wishlist + Share */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`
              w-11 h-11 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer
              ${
                isWishlisted
                  ? "border-error bg-error/5 text-error"
                  : "border-border text-text-muted hover:border-error hover:text-error hover:bg-error/5"
              }
            `}
            title={t("productInfo.wishlist")}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className="w-11 h-11 rounded-lg border border-border text-text-muted hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 flex items-center justify-center transition-all duration-200 cursor-pointer"
            title={t("productInfo.share")}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-border" />

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Truck, label: t("productInfo.freeShipping") },
          { icon: ShieldCheck, label: t("productInfo.warranty") },
          { icon: BadgeCheck, label: t("productInfo.genuine") },
          { icon: RefreshCcw, label: t("productInfo.returnPolicy") },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-text-secondary">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-primary-500" />
            </div>
            <span className="text-xs font-medium leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
