import { useEffect, useState } from "react";
import { Divider, Input } from "antd";
import { fetchProductsByIds } from "../../gio-hang/_components/cart-api";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Product } from "@/types/users/products/product";
import { IMG_PLACEHOLDER } from "@/constant/application";

type Props = {
  shippingCost: number;
  onTotalChange: (total: number) => void;
  subTotal: number;
  onSubmit: () => void;
};

export default function CartSummary({
  shippingCost,
  onTotalChange,
  onSubmit,
}: Props) {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProductsByIds(cartItems.map((i) => String(i.id))).then((data) => {
      const productsWithQuantity = data.map((prod) => {
        const cartItem = cartItems.find((item) => item.id === prod.id);
        return { ...prod, quantity: cartItem?.quantity || 1 };
      });
      setProducts(productsWithQuantity);
      setLoading(false);
    });
  }, [cartItems]);

  const subTotal = products.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const estimatedTaxes = 5000;
  const total = subTotal + shippingCost + estimatedTaxes;

  useEffect(() => {
    if (!loading) onTotalChange(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTotal, shippingCost, estimatedTaxes, loading]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow h-full min-h-[500px] flex flex-col relative">
      <h2 className="text-xl font-semibold">Giỏ hàng của bạn</h2>
      <div className="my-4 pt-2 flex flex-col gap-3 max-h-[300px] overflow-auto relative">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-3 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))
          : products.map((item) => (
              <div key={item.id} className="flex gap-3 relative">
                <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={item.image[0] || IMG_PLACEHOLDER}
                    alt={item.name}
                    className="object-contain w-full h-full"
                    fill
                    priority
                    sizes="100%"
                  />
                </div>
                <div className="absolute -top-2 left-13 z-10">
                  <span className="bg-black text-white text-[12px] w-5 h-5 flex items-center justify-center rounded-full leading-none">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-800 leading-5 line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.price.toLocaleString()} vnđ
                  </p>
                </div>
              </div>
            ))}
      </div>
      <Divider />
      <Input
        placeholder="Mã giảm giá"
        addonAfter="Áp dụng"
        className="mb-4"
        disabled={loading}
      />

      <div className="pt-4 text-sm space-y-2 flex-1">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="flex justify-between">
              <span className="h-4 bg-gray-200 rounded w-1/4" />
              <span className="h-4 bg-gray-200 rounded w-1/6" />
            </div>
            <div className="flex justify-between">
              <span className="h-4 bg-gray-200 rounded w-1/4" />
              <span className="h-4 bg-gray-200 rounded w-1/6" />
            </div>
            <div className="flex justify-between">
              <span className="h-4 bg-gray-200 rounded w-1/4" />
              <span className="h-4 bg-gray-200 rounded w-1/6" />
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="h-5 bg-gray-300 rounded w-1/4" />
              <span className="h-5 bg-gray-300 rounded w-1/6" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{subTotal.toLocaleString()} vnđ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng</span>
              <span>{shippingCost.toLocaleString()} vnđ</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế ước tính</span>
              <span>{estimatedTaxes.toLocaleString()} vnđ</span>
            </div>
            <Divider />
            <div className="flex justify-between font-semibold text-base pt-2">
              <span>Tổng cộng</span>
              <span>{total.toLocaleString()} vnđ</span>
            </div>
          </>
        )}
      </div>

      <CustomLink>
        <button
          className="bg-black text-white font-medium px-5 py-2 rounded-md cursor-pointer w-full mt-4 sm:mt-0"
          onClick={onSubmit}
        >
          Tiếp tục thanh toán
        </button>
      </CustomLink>
    </div>
  );
}
