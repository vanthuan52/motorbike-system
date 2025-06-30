import { useState } from "react";
import { ConfigProvider, Image } from "antd";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { addToCart } from "@/features/cart/store/cart-slice";
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const imgSrc = Array.isArray(product.image)
    ? product.image[0]
    : product.image;
  const isList = layout === "list";
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({ id: product.id, color: product.colors[0], quantity: 1 })
    );
    toast.success(t("productCard.addToCartSuccess"));
  };

  return (
    <motion.div
      transition={{ type: "ease" }}
      className={`group relative border border-gray-200 bg-gray-50 transition-all duration-300 
      p-4 overflow-visible 
      ${isList ? "flex gap-4 items-start" : "flex flex-col"}`}
    >
      <div
        className={`relative rounded-lg overflow-hidden 
        ${isList ? "w-40 h-40 flex-shrink-0" : "w-full h-48"}`}
      >
        <ConfigProvider
          theme={{
            components: {
              Image: {
                previewOperationColor: "#111827",
                colorInfoBgHover: "transparent",
              },
            },
          }}
        >
          <Image
            src={imgSrc}
            fallback={IMG_PLACEHOLDER}
            alt={product.name}
            className="object-cover w-full h-full"
            preview={{
              visible: previewOpen,
              onVisibleChange: (v) => setPreviewOpen(v),
              mask: null,
            }}
          />
        </ConfigProvider>

        <button
          type="button"
          aria-label={t("productCard.preview")}
          onClick={() => setPreviewOpen(true)}
          className="absolute right-2 bottom-2 bg-gray-100 hover:bg-white border border-gray-300 w-7 h-7 rounded-lg flex items-center justify-center shadow"
        >
          <Eye size={16} className="text-gray-700" />
        </button>
      </div>

      <div
        className={`${isList ? "flex-1 flex flex-col justify-between" : "mt-3 text-center"}`}
      >
        <p className="text-lg font-medium text-gray-700 text-left">
          {product.price.toLocaleString()}₫
        </p>
        <Link href={`/san-pham/${product.slug}`}>
          <h4 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 text-left h-12 lg:h-8">
            {product.name}
          </h4>
          {isList && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
        </Link>
        <div
          className={`${isList ? "flex items-center justify-between mt-auto" : "mt-2"}`}
        >
          {isList ? (
            <div className="flex gap-2 mt-4">
              <button className="bg-white text-gray-700 text-sm px-3 py-1 rounded border hover:bg-gray-100 transition">
                {t("productCard.quickBuy")}
              </button>
              <button
                className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800 transition"
                onClick={handleAddToCart}
              >
                {t("productCard.addToCart")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-2 justify-center overflow-hidden transition-all duration-300 h-full mt-2">
              <button className="bg-white text-gray-700 text-sm px-2 py-1 rounded border hover:bg-gray-100 transition max-h-[30px] line-clamp-1">
                {t("productCard.quickBuy")}
              </button>
              <button
                className="bg-black text-white text-sm px-2 py-1 rounded hover:bg-gray-800 transition max-h-[30px] line-clamp-1"
                onClick={handleAddToCart}
              >
                {t("productCard.addToCart")}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
