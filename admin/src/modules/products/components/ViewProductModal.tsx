import { Image, Modal, Tag } from "antd";
import { Product } from "../types";
import { useMemo } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { IMG_PLACEHOLDER } from "@/constants/application";

type Props = {
  initialData?: Product | null;
  visible: boolean;
  onCancel: () => void;
};

const statusMap: Record<string, { color: string; label: string }> = {
  in_stock: { color: "green", label: "Còn hàng" },
  out_of_stock: { color: "red", label: "Hết hàng" },
  out_of_business: { color: "gray", label: "Ngừng Kinh doanh" },
};

export default function ViewProductModal({
  initialData,
  visible,
  onCancel,
}: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  const categoryName = useMemo(() => {
    if (!initialData) return "";
    const found = mockDataTableVehiclePart.find(
      (item) => item.id === initialData.category_id
    );
    return found?.name || initialData.category_id;
  }, [initialData]);

  if (!initialData) return null;

  const images =
    initialData.image && initialData.image.length > 0
      ? initialData.image
      : [IMG_PLACEHOLDER];

  const handlePrev = () =>
    setImgIdx((idx) => (idx === 0 ? images.length - 1 : idx - 1));
  const handleNext = () =>
    setImgIdx((idx) => (idx === images.length - 1 ? 0 : idx + 1));

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title="Chi tiết sản phẩm"
      width={700}
      destroyOnHidden
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 w-full flex flex-col items-center">
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src={images[imgIdx]}
              alt={initialData.name}
              className="object-contain w-full h-full"
              fallback={IMG_PLACEHOLDER}
            />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-5 shadow"
                  onClick={handlePrev}
                  tabIndex={-1}
                >
                  <LeftOutlined />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-5 shadow"
                  onClick={handleNext}
                  tabIndex={-1}
                >
                  <RightOutlined />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {images.map((img, i) => (
                <Image
                  key={img}
                  src={img}
                  alt=""
                  className={`!w-20 !h-20 object-cover rounded border cursor-pointer ${i === imgIdx ? "border-blue-500" : "border-gray-200"}`}
                  onClick={() => setImgIdx(i)}
                  preview={false}
                  fallback={IMG_PLACEHOLDER}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <div className="text-gray-500 text-base mb-1">Mã sản phẩm</div>
            <div className="font-semibold">{initialData.sku}</div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Tên sản phẩm</div>
            <div className="font-semibold">{initialData.name}</div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Hãng</div>
            <div>{initialData.brand_id}</div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Danh mục</div>
            <div>{categoryName}</div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Giá Nhập</div>
            <div className="font-semibold text-red-600">
              {initialData.cost.toLocaleString("vi-VN")} vnđ
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Giá bán</div>
            <div className="font-semibold text-red-600">
              {initialData.price.toLocaleString("vi-VN")} vnđ
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Tồn kho</div>
            <div>{initialData.stock}</div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Xuất xứ</div>
            <div>{initialData.origin}</div>
          </div>
          <div>
            <div className="text-gray-500 text-base mb-1">Tình trạng</div>
            <Tag color={statusMap[initialData.status]?.color || "default"}>
              {statusMap[initialData.status]?.label || initialData.status}
            </Tag>
          </div>
          <div className="md:col-span-2">
            <div className="text-gray-500 text-base mb-1">Màu sắc</div>
            <div className="flex flex-wrap gap-2">
              {initialData.colors && initialData.colors.length > 0 ? (
                initialData.colors.map((color) => (
                  <span
                    key={color}
                    className="px-2 py-1 rounded bg-gray-100 border text-gray-700 text-base"
                  >
                    {color}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">Không có</span>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-gray-500 text-base mb-1">Mô tả</div>
            <div className="bg-gray-50 rounded p-2 text-gray-700 text-sm whitespace-pre-line">
              {initialData.description}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
