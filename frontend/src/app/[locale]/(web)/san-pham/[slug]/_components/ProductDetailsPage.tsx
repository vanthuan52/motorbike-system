"use client";
import { useParams } from "next/navigation";
// @ts-expect-error: Swiper CSS imports don't have types
import "swiper/css";
// @ts-expect-error: Swiper CSS imports don't have types
import "swiper/css/thumbs";
import { useTranslations } from "next-intl";
import React from "react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { mockProducts } from "@/data/Products";
import SmartBreadcrumb from "@/components/breadcrumb/SmartBreadcrumb";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function ProductDetailsPage() {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT_DETAIL);
  const params = useParams<{ slug: string }>();
  const slug =
    typeof params === "object" && "slug" in params ? params.slug : "";
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) return <div>Không tìm thấy sản phẩm</div>;
  return (
    <>
      <SmartBreadcrumb customLabel={product.name} />
      <section className="bg-gray-100 py-4 min-h-screen">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            <ProductImageGallery images={product.image} />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>
    </>
  );
}
