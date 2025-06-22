"use client";
import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/thumbs";
import React from "react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { mockProducts } from "@/data/Products";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import SmartBreadcrumb from "@/components/breadcrum/SmartBreadcrumb";

export default function ProductDetailsPage() {
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
          <ol className="flex items-center whitespace-nowrap py-4 text-xs sm:text-sm">
            <li className="inline-flex items-center">
              <CustomLink
                className="text-gray-500 hover:text-blue-600"
                href="/"
              >
                Trang chủ
              </CustomLink>
              <svg className="mx-2 size-4 text-gray-400" viewBox="0 0 24 24">
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </li>
            <li className="inline-flex items-center">
              <CustomLink
                className="text-gray-500 hover:text-blue-600"
                href="/products"
              >
                Sản phẩm
              </CustomLink>
              <svg className="mx-2 size-4 text-gray-400" viewBox="0 0 24 24">
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </li>
            <li className="font-semibold text-gray-800 truncate">
              {product.name}
            </li>
          </ol>

          <div className="flex flex-col lg:flex-row gap-10">
            <ProductImageGallery images={product.image} />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>
    </>
  );
}
