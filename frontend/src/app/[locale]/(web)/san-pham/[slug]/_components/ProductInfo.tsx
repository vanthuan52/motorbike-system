import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { toast } from "react-toastify";
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
  const dispatch = useDispatch();
  const handleAddToCart = (product: Product, quantity: number) => {
    dispatch(addToCart({ id: product.id, color: product.colors[0], quantity }));
    toast.success(t("productInfo.toast.success"));
  };
  return (
    <div className="flex-1 flex flex-col justify-start gap-10 sm:py-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={
            "px-4 py-1 border border-gray-300 rounded-full text-base font-semibold " +
            (product.status === "in_stock"
              ? "bg-green-900 text-white"
              : product.status === "out_of_stock"
                ? "bg-yellow-300 text-gray-700"
                : "bg-gray-200 text-gray-500")
          }
        >
          {product.status === "in_stock" && "Còn hàng"}
          {product.status === "out_of_stock" && "Hết hàng"}
          {product.status === "out_of_business" && "Ngừng kinh doanh"}
        </span>
        <span className="px-4 py-1 border border-gray-300 rounded-full text-base bg-gray-100 text-gray-700 font-medium">
          {product.partTypeId
            ? mockDataTableVehiclePart.find(
                (cat) => cat.id === product.partTypeId
              )?.name
            : t("productInfo.category.unknown")}
        </span>
        <span className="px-4 py-1 border border-gray-300 rounded-full text-base bg-gray-100 text-gray-700 font-medium">
          {product.origin}
        </span>
        <span className="px-4 py-1 border border-gray-300 rounded-full text-base bg-gray-100 text-gray-700 font-medium">
          {t("productInfo.stock")}: {product.stock}
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-base text-gray-800 font-medium">
          {t("productInfo.color")}:
        </span>
        {product.colors.map((color, idx) => (
          <span
            key={color + idx}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="text-3xl font-bold text-black">
          {product.price.toLocaleString()}₫
        </span>
        <div className="flex gap-3">
          <button className="flex items-center border justify-center bg-gray-100 hover:bg-gray-200 transition px-4 py-3 rounded-xl">
            <IoShareOutline size={24} className="text-black" />
          </button>
          <button className="flex items-center border justify-center bg-gray-100 hover:bg-gray-200 transition px-4 py-3 rounded-xl">
            <CiHeart size={24} className="text-black" />
          </button>
        </div>
      </div>
      <div>
        <p className="text-lg text-gray-700 break-words">
          {product.description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-900 font-medium text-base">
            {t("productInfo.quantity")}
          </span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            <button
              className="px-4 py-1 text-xl text-black hover:bg-gray-100 border-r"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-[74px] text-center text-lg bg-white text-black"
            />
            <button
              className="px-4 py-1 text-xl text-black hover:bg-gray-100 border-l"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>
        <button
          className={`
    w-[220px] h-12 font-semibold text-base rounded-lg border
    transition
    ${
      product.status !== "in_stock"
        ? "bg-gray-300 border-gray-300 text-white cursor-not-allowed opacity-70"
        : "bg-black border-black text-white cursor-pointer hover:bg-gray-900"
    }
  `}
          onClick={() => handleAddToCart(product, quantity)}
          disabled={product.status !== "in_stock"}
        >
          {product.status === "in_stock"
            ? t("productInfo.addToCart")
            : t("productInfo.outOfStock")}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-900 font-medium text-base">
            {t("productInfo.formOfDelivery")}
          </span>
        </div>
      </div>
    </div>
  );
}
