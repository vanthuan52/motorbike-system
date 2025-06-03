import { CustomLink } from '@/shared/components/CustomerLink/CustomLink'
import { Product } from '@/types/users/products/product'
import { ConfigProvider, Image } from 'antd'
import { Eye } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
    layout?: "grid" | "list"
}

export default function ProductCard({ product, layout = "grid" }: ProductCardProps) {
    const colorMap: Record<string, string> = {
        Black: "#222",
        White: "#fff",
        Silver: "#C0C0C0",
        Red: "#EF4444",
        Blue: "#3B82F6",
        Orange: "#F59E42",
    }

    const statusMap: Record<string, { label: string; color: string }> = {
        in_stock: { label: "Còn hàng", color: "bg-green-100 text-green-700" },
        out_of_stock: { label: "Hết hàng", color: "bg-yellow-100 text-yellow-700" },
        out_of_business: { label: "Ngừng kinh doanh", color: "bg-gray-200 text-gray-500" },
    }

    const [previewOpen, setPreviewOpen] = useState(false)
    const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image

    return (
        <div
            className={
                (layout === "list"
                    ? "flex flex-col sm:flex-row items-center"
                    : "flex flex-col") +
                " bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 ease-in-out p-4 gap-4 relative"
            }
            style={{
                minHeight: layout === "list" ? 180 : undefined,
            }}
        >
            {product.status && (
                <span className={`absolute top-6 left-6 ${statusMap[product.status]?.color || "bg-gray-100 text-gray-500"} text-xs font-semibold px-2 py-1 rounded-full z-10`}>
                    {statusMap[product.status]?.label || product.status}
                </span>
            )}
            <div
                className={
                    (layout === "list"
                        ? "relative w-full sm:w-40 h-40 flex-shrink-0"
                        : "w-full h-48 relative mb-4") +
                    " rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                }
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Image: {
                                previewOperationColor: "#111827",
                                colorInfoBgHover: "transparent",
                            }
                        }
                    }}
                >
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        className="object-cover rounded-lg transition-all duration-300 ease-in-out"
                        sizes="(max-width: 640px) 100vw, 300px"
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (v) => setPreviewOpen(v),
                            mask: null
                        }}
                    />
                </ConfigProvider>
                <button
                    type="button"
                    aria-label="Xem ảnh lớn"
                    onClick={() => setPreviewOpen(true)}
                    style={{
                        position: "absolute",
                        right: 12,
                        bottom: 12,
                        background: "rgba(243,244,246,0.9)",
                        borderRadius: "10px",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                >
                    <Eye size={16} style={{ color: "#111827" }} />
                </button>
            </div>
            <CustomLink href={`/san-pham/${product.slug}`}>
                <div className={layout === "list" ? "flex-1 flex flex-col justify-between h-full transition-all duration-300" : "transition-all duration-300"}>
                    <div>
                        <h4 className="text-base font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-gray-600">
                                {product.price.toLocaleString()}₫
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {product.colors?.map((c: string) => (
                                <span
                                    key={c}
                                    className="h-5 w-5 rounded-full border border-gray-200"
                                    style={{ backgroundColor: colorMap[c] || c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>
                    {layout === "list" && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                    )}
                </div>
            </CustomLink>
        </div>
    )
}