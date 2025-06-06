import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  updateCartItem,
  deleteFromCart,
} from "@/store/features/cart/cart-slice";
import { fetchProductsByIds } from "./cart-api";
import Skeleton from "./Skeleton";
import { Product } from "@/types/users/products/product";
import { IMG_PLACEHOLDER } from "@/constant/application";
import { FaHeart } from "react-icons/fa";

export default function CartTable({
  onTotalChange,
}: {
  onTotalChange: (total: number) => void;
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
      setProducts([]);
      onTotalChange(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProductsByIds(cartItems.map((i) => String(i.id))).then((data) => {
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

  const handleIncrease = (id: string | number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity < 99) {
      dispatch(updateCartItem({ item, newQuantity: item.quantity + 1 }));
    }
  };

  const handleDecrease = (id: string | number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity > 1) {
      dispatch(updateCartItem({ item, newQuantity: item.quantity - 1 }));
    }
  };

  const handleRemove = (id: string | number, color?: string) => {
    const item = cartItems.find((i) => i.id === id && i.color === color);
    if (item) {
      dispatch(deleteFromCart(item));
    }
  };

  if (loading) return <Skeleton products={cartItems.length} />;

  if (cartItems.length === 0)
    return (
      <div className="text-center py-10 text-gray-400">
        Giỏ hàng của bạn đang trống.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <div className="min-w-[600px] w-full text-sm sm:text-base border border-gray-200 p-2 rounded-xl">
          <div>
            {products.map((p) => {
              const item = cartItems.find((i) => i.id === p.id);
              if (!item) return null;
              return (
                <div
                  key={p.id}
                  className="border-b border-gray-200 bg-white rounded-xl flex w-full justify-between items-center"
                >
                  <div className="flex justify-center items-center">
                    <div className="py-1 sm:py-2 px-1 sm:px-2 align-middle">
                      <RiDeleteBin6Line size={24} onClick={() => handleRemove(p.id)} className="cursor-pointer hover:text-red-500" />
                      <FaHeart size={24} className="cursor-pointer hover:text-pink-500 hover:!fill-pink-500 mt-2" />
                    </div>
                    <div className="py-1 sm:py-2 px-1 sm:px-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative rounded overflow-hidden bg-gray-100 border border-gray-200 w-10 h-10 sm:w-16 sm:h-16">
                          <Image
                            src={p.image[0]}
                            placeholder="blur"
                            blurDataURL={IMG_PLACEHOLDER}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900 text-xs sm:text-base line-clamp-2 max-w-[80px] sm:max-w-none">
                          {p.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-1 sm:py-2 px-1 sm:px-2 text-right text-gray-800 whitespace-nowrap">
                    {p.price.toLocaleString()} đ
                  </div>
                  <div className="py-1 sm:py-2 px-1 sm:px-2 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <Button
                        icon={<MinusOutlined />}
                        size="small"
                        shape="circle"
                        className="border border-gray-300 text-gray-600 hover:bg-gray-200"
                        onClick={() => handleDecrease(p.id)}
                        disabled={item.quantity <= 1}
                      />
                      <span className="inline-block w-6 sm:w-8 text-center text-gray-900">
                        {item.quantity}
                      </span>
                      <Button
                        icon={<PlusOutlined />}
                        size="small"
                        shape="circle"
                        className="border border-gray-300 text-gray-600 hover:bg-gray-200"
                        onClick={() => handleIncrease(p.id)}
                        disabled={item.quantity >= 99}
                      />
                    </div>
                  </div>
                  <div className="py-1 sm:py-2 px-1 sm:px-2 text-right font-semibold text-gray-900 whitespace-nowrap">
                    {(p.price * item.quantity).toLocaleString()} đ
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}