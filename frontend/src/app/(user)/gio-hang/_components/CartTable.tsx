"use client";
import { useEffect, useState } from "react";
import { fetchProductsByIds, ProductDetail } from "./cart-api";
import { Button } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Skeleton from "./Skeleton";

const fakeCartItems = [
    { id: "1", quantity: 2 },
    { id: "2", quantity: 1 },
    { id: "3", quantity: 3 },
    { id: "4", quantity: 1 },
    { id: "5", quantity: 2 },
    { id: "6", quantity: 1 },
    { id: "7", quantity: 1 },
    { id: "8", quantity: 1 },
];

export default function CartTable({ onTotalChange }: { onTotalChange: (total: number) => void }) {
    const [cartItems, setCartItems] = useState(fakeCartItems);
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cartItems.length === 0) {
            setProducts([]);
            onTotalChange(0);
            setLoading(false);
            return;
        }
        setLoading(true);
        fetchProductsByIds(cartItems.map((i) => i.id)).then((data) => {
            setProducts(data);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems.length]);

    useEffect(() => {
        const total = products.reduce((sum, p) => {
            const item = cartItems.find((i) => i.id === p.id);
            return sum + (item?.quantity || 0) * p.price;
        }, 0);
        onTotalChange(total);
    }, [cartItems, products, onTotalChange]);

    const handleQuantityChange = (id: string, value: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: value } : item
            )
        );
    };

    const handleIncrease = (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (item && item.quantity < 99) {
            handleQuantityChange(id, item.quantity + 1);
        }
    };

    const handleDecrease = (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (item && item.quantity > 1) {
            handleQuantityChange(id, item.quantity - 1);
        }
    };

    const handleRemove = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    if (loading) return <Skeleton products={cartItems.length} />

    if (cartItems.length === 0)
        return <div className="text-center py-10 text-gray-400">Giỏ hàng của bạn đang trống.</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow p-3 sm:p-4 md:p-6 "
        >
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="min-w-[600px] w-full text-sm sm:text-base">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="w-8 sm:w-10 sticky top-0 z-10 bg-white"></th>
                            <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-gray-700 font-semibold whitespace-nowrap sticky top-0 z-10 bg-white">
                                <span className="hidden sm:inline">Sản phẩm</span>
                                <span className="inline sm:hidden">SP</span>
                            </th>
                            <th className="text-right py-2 sm:py-3 px-1 sm:px-2 text-gray-700 font-semibold whitespace-nowrap sticky top-0 z-10 bg-white">
                                Giá
                            </th>
                            <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-gray-700 font-semibold whitespace-nowrap sticky top-0 z-10 bg-white">
                                SL
                            </th>
                            <th className="text-right py-2 sm:py-3 px-1 sm:px-2 text-gray-700 font-semibold whitespace-nowrap sticky top-0 z-10 bg-white">
                                <span className="hidden sm:inline">Tạm tính</span>
                                <span className="inline sm:hidden">Tính</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => {
                            const item = cartItems.find((i) => i.id === p.id);
                            if (!item) return null;
                            return (
                                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 align-middle">
                                        <Button
                                            icon={<CloseOutlined />}
                                            size="small"
                                            shape="circle"
                                            aria-label="Xóa"
                                            className="hover:bg-gray-200 border-none text-gray-400"
                                            onClick={() => handleRemove(p.id)}
                                        />
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="relative rounded overflow-hidden bg-gray-100 border border-gray-200 w-10 h-10 sm:w-16 sm:h-16">
                                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-900 text-xs sm:text-base line-clamp-2 max-w-[80px] sm:max-w-none">
                                                {p.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 text-right text-gray-800 whitespace-nowrap">
                                        {p.price.toLocaleString()} đ
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 text-center">
                                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                                            <Button
                                                icon={<MinusOutlined />}
                                                size="small"
                                                shape="circle"
                                                className="border border-gray-300 text-gray-600 hover:bg-gray-200"
                                                onClick={() => handleDecrease(p.id)}
                                                disabled={item.quantity <= 1}
                                            />
                                            <span className="inline-block w-6 sm:w-8 text-center text-gray-900">{item.quantity}</span>
                                            <Button
                                                icon={<PlusOutlined />}
                                                size="small"
                                                shape="circle"
                                                className="border border-gray-300 text-gray-600 hover:bg-gray-200"
                                                onClick={() => handleIncrease(p.id)}
                                                disabled={item.quantity >= 99}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 text-right font-semibold text-gray-900 whitespace-nowrap">
                                        {(p.price * item.quantity).toLocaleString()} đ
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}