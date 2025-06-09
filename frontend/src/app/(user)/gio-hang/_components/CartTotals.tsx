"use client";

import clsx from "clsx";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export default function CartTotals({ subtotal }: { subtotal: number }) {
  const shipping = subtotal > 0 ? 45000 : 0;
  const total = subtotal + shipping;
  return (
    <div className="bg-white rounded-xl shadow p-6 min-w-[320px]">
      <h2 className="font-bold text-lg mb-4">Tổng giỏ hàng</h2>
      <div className="flex justify-between py-2 border-b">
        <span>Tạm tính</span>
        <span className="font-semibold">{subtotal.toLocaleString()} đ</span>
      </div>
      <div className="flex justify-between py-2 border-b">
        <span>Phí vận chuyển</span>
        <span>
          {shipping > 0 ? (
            <>
              <span className="font-semibold">
                {shipping.toLocaleString()} đ
              </span>
              <span className="ml-1 text-gray-500">(Giao hàng tiêu chuẩn)</span>
            </>
          ) : (
            <span>0 đ</span>
          )}
        </span>
      </div>
      <div className="flex justify-between py-2 mt-2 text-lg font-bold text-orange-600">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()} đ</span>
      </div>
      <CustomLink href={total === 0 ? "#" : "/chi-tiet-thanh-toan"}>
        <button
          className={clsx(
            "w-full mt-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition",
            total === 0 && "opacity-60 cursor-not-allowed"
          )}
          disabled={total === 0}
          tabIndex={total === 0 ? -1 : 0}
          onClick={(e) => {
            if (total === 0) e.preventDefault();
          }}
        >
          Tiến hành thanh toán
        </button>
      </CustomLink>
    </div>
  );
}
