"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { mockProducts } from "@/data/Products";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function ProductDetailsPage() {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT_DETAIL);
  const params = useParams<{ slug: string }>();
  const slug =
    typeof params === "object" && "slug" in params ? params.slug : "";
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-muted text-lg">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.productList"), href: "/san-pham" },
    { label: product.name },
  ];

  return (
    <div className="bg-surface min-h-screen">
      <div className="container pt-5">
        <Breadcrumbs
          items={breadcrumbs}
          className="pb-6"
          linkClassName="hover:!underline"
          activeClassName="text-text-primary font-semibold"
        />
      </div>

      <section className="pb-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left column: Gallery + Description (scrollable) */}
            <div className="w-full lg:w-[55%]">
              <ProductImageGallery images={product.image} />

              {/* Product Description — rendered as rich text content */}
              <div className="mt-10 pt-8 border-t border-border">
                <h2 className="text-lg font-bold text-text-primary mb-4">
                  {t("productInfo.description")}
                </h2>
                <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>

            {/* Right column: Product Info (sticky) */}
            <div className="w-full lg:w-[45%] lg:sticky lg:top-6 lg:self-start">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
