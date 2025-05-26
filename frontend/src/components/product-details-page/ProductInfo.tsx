import React, { useState } from "react";
import { Button } from "antd";
import { IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { Product } from "@/types/users/products/product";
import { mockDataTableVehiclePart } from "@/data/TableData"
interface ProductInfoProps {
    product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex-1 flex flex-col justify-start gap-10 sm:py-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
                {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
                <span className={
                    "px-4 py-1 border border-gray-300 rounded-full text-base font-semibold " +
                    (product.status === "in_stock"
                        ? "bg-green-900 text-white"
                        : product.status === "out_of_stock"
                            ? "bg-yellow-300 text-gray-700"
                            : "bg-gray-200 text-gray-500")
                }>
                    {product.status === "in_stock" && "Còn hàng"}
                    {product.status === "out_of_stock" && "Hết hàng"}
                    {product.status === "out_of_business" && "Ngừng kinh doanh"}
                </span>
                <span className="px-4 py-1 border border-gray-300 rounded-full text-base bg-gray-100 text-gray-700 font-medium">
                    {product.category_id ? mockDataTableVehiclePart.find(cat => cat.id === product.category_id)?.name : "Không xác định"}
                </span>
                <span className="px-4 py-1 border border-gray-300 rounded-full text-base bg-gray-100 text-gray-700 font-medium">
                    {product.origin}
                </span>
                <span className="px-4 py-1 border border-gray-300 rounded-full text-base bg-gray-100 text-gray-700 font-medium">
                    Số lượng: {product.stock}
                </span>
            </div>
            <div className="flex gap-4 items-center">
                <span className="text-base text-gray-800 font-medium">Màu sắc:</span>
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
                <p className="text-lg text-gray-700 break-words">{product.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
                <div className="flex items-center gap-3">
                    <span className="text-gray-900 font-medium text-base">Số lượng</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                            className="px-4 py-1 text-xl text-black hover:bg-gray-100 border-r"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >−</button>
                        <input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-[74px] text-center text-lg bg-white text-black"
                        />
                        <button
                            className="px-4 py-1 text-xl text-black hover:bg-gray-100 border-l"
                            onClick={() => setQuantity(q => q + 1)}
                        >+</button>
                    </div>
                </div>
                <Button
                    style={{
                        backgroundColor: product.status !== "in_stock" ? "#ccc" : "#000",
                        borderColor: product.status !== "in_stock" ? "#ccc" : "#000",
                        color: "#fff",
                        width: 220,
                        height: 48,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: product.status !== "in_stock" ? "not-allowed" : "pointer",
                        opacity: product.status !== "in_stock" ? 0.7 : 1,
                    }}
                    disabled={product.status !== "in_stock"}
                >
                    {product.status === "in_stock" ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
                <div className="flex items-center gap-3">
                    <span className="text-gray-900 font-medium text-base">Hình thức giao hàng</span>

                </div>
            </div>
        </div >
    );
}