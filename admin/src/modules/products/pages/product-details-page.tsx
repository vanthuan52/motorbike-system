import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { IMG_PLACEHOLDER } from "@/constants/application";
import SkeletonProductDetails from "../components/SkeletonProductDetails";
import ProductInfo from "../components/ProductInfo";
import ProductImageGallery from "../components/ProductImageGallery";
import { RootState } from "@/store";
import { productsActions } from "../store/products-slice";

const statusMap = {
  in_stock: { color: "green", label: "Còn hàng" },
  out_of_stock: { color: "red", label: "Hết hàng" },
  out_of_business: { color: "gray", label: "Ngừng Kinh doanh" },
};

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")} vnđ`;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetail, isDetailLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (params.slug) {
      dispatch(productsActions.fetchProductDetailRequest(params.slug));
    }
  }, [dispatch, params.slug]);

  const categoryName = useMemo(() => {
    if (!productDetail) return "";
    const found = mockDataTableVehiclePart.find(
      (item) => item.id === productDetail.category_id
    );
    return found?.name || productDetail.category_id;
  }, [productDetail]);

  if (isDetailLoading) {
    return <SkeletonProductDetails />;
  }

  if (!productDetail) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy sản phẩm!
      </div>
    );
  }

  const images =
    productDetail.image && productDetail.image.length > 0
      ? productDetail.image
      : [IMG_PLACEHOLDER];

  return (
    <div className="sm:px-4 my-10 sm:mt-2 mx-4 bg-white rounded-xl shadow p-6">
      <div className="flex gap-2 items-center mb-6 w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <div className="sm:text-2xl font-bold">
          Chi tiết sản phẩm{" "}
          <span className="text-gray-500">{productDetail.name}</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <ProductImageGallery images={images} />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductInfo label="Mã sản phẩm" value={productDetail.sku} />
          <ProductInfo label="Tên sản phẩm" value={productDetail.name} />
          <ProductInfo label="Hãng" value={productDetail.brand_id} />
          <ProductInfo label="Danh mục" value={categoryName} />
          <ProductInfo
            label="Giá Nhập"
            value={formatPrice(productDetail.cost)}
            highlight
          />
          <ProductInfo
            label="Giá Bán"
            value={formatPrice(productDetail.price)}
            highlight
          />
          <ProductInfo label="Tồn kho" value={productDetail.stock.toString()} />
          <ProductInfo label="Xuất xứ" value={productDetail.origin} />
          <ProductInfo label="Tình trạng">
            <Tag
              color={
                statusMap[productDetail.status as keyof typeof statusMap]
                  ?.color || "default"
              }
            >
              {statusMap[productDetail.status as keyof typeof statusMap]
                ?.label || productDetail.status}
            </Tag>
          </ProductInfo>
          <ProductInfo label="Màu sắc" colSpan={2}>
            <div className="flex flex-wrap gap-2">
              {productDetail.colors && productDetail.colors.length > 0 ? (
                productDetail.colors.map((color: string) => (
                  <span
                    key={color}
                    className="px-2 py-1 rounded bg-gray-100 border text-gray-700 text-sm"
                  >
                    {color}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">Không có</span>
              )}
            </div>
          </ProductInfo>
          <ProductInfo label="Mô tả" colSpan={2}>
            <div className="bg-gray-50 rounded p-2 text-gray-700 text-sm whitespace-pre-line">
              {productDetail.description}
            </div>
          </ProductInfo>
        </div>
      </div>
    </div>
  );
}
