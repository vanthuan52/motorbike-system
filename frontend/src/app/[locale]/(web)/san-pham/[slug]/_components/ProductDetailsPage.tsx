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
          <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-8 lg:gap-12 items-start">
            {/* Gallery */}
            <div className="order-1">
              <ProductImageGallery images={product.image} />
            </div>

            {/* Right column: Product Info (sticky on desktop) */}
            <div className="order-2 lg:sticky lg:top-6 lg:self-start">
              <ProductInfo product={product} />
            </div>

            {/* Product Description — below product info on mobile, below gallery on desktop */}
            <div className="order-3 lg:order-3 lg:col-start-1 pt-8 border-t border-border">
              <h2 className="text-lg font-bold text-text-primary mb-4">
                {t("productInfo.description")}
              </h2>
              <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
