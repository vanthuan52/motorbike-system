export type ServiceKey =
  | "dai-tu-dong-co"
  | "son-xi-don-moi"
  | "bao-duong"
  | "sua-chua";

export type Service = {
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  image: string;
  description: string;
};

export function getServiceData(type: string): Service {
  const services: Record<ServiceKey, Service> = {
    "dai-tu-dong-co": {
      name: "Đại tu động cơ",
      rating: 4.5,
      reviewCount: 128,
      price: "Từ 2.500.000đ",
      image: "/images/care-service/dai-tu-dong-co.webp",
      description:
        "Dịch vụ đại tu động cơ toàn diện bao gồm tháo rời, kiểm tra, thay thế các chi tiết hư hỏng, lắp ráp và chạy thử. Chúng tôi sử dụng phụ tùng chính hãng và cam kết bảo hành 6 tháng cho dịch vụ.",
    },
    "son-xi-don-moi": {
      name: "Sơn-xi-dọn mới",
      rating: 4.7,
      reviewCount: 89,
      price: "Từ 1.800.000đ",
      image: "/images/care-service/son-xi-don-moi.webp",
      description:
        "Dịch vụ sơn xi dọn mới chuyên nghiệp với quy trình chuẩn: xử lý bề mặt, chống gỉ, phun lót, sơn màu và phủ bóng. Sử dụng sơn chất lượng cao, bảo hành màu sơn 2 năm.",
    },
    "bao-duong": {
      name: "Bảo dưỡng",
      rating: 4.8,
      reviewCount: 245,
      price: "Từ 300.000đ",
      image: "/images/care-service/bao-duong-xe-may.webp",
      description:
        "Dịch vụ bảo dưỡng định kỳ theo hãng xe gồm: thay dầu máy, lọc dầu, kiểm tra hệ thống phanh, lốp xe, đèn chiếu sáng và các hệ thống khác. Đảm bảo xe luôn hoạt động ổn định.",
    },
    "sua-chua": {
      name: "Sửa chữa",
      rating: 4.6,
      reviewCount: 156,
      price: "Từ 200.000đ",
      image: "/images/care-service/sua-chua.webp",
      description:
        "Dịch vụ sửa chữa đa dạng từ các vấn đề nhỏ đến các sự cố phức tạp. Đội ngũ kỹ thuật viên giàu kinh nghiệm, trang bị máy móc hiện đại, cam kết sửa chữa nhanh chóng và hiệu quả.",
    },
  };

  return services[type as ServiceKey] || services["sua-chua"];
}

export type RelatedService = {
  id: number;
  name: string;
  slug: string;
  rating: number;
  price: string;
  image: string;
};

export function getRelatedServices(currentType: string): RelatedService[] {
  const allServices: RelatedService[] = [
    {
      id: 1,
      name: "Đại tu động cơ",
      slug: "dai-tu-dong-co",
      rating: 4.5,
      price: "Từ 2.500.000đ",
      image: "/images/care-service/dai-tu-dong-co.webp",
    },
    {
      id: 2,
      name: "Sơn-xi-dọn mới",
      slug: "son-xi-don-moi",
      rating: 4.7,
      price: "Từ 1.800.000đ",
      image: "/images/care-service/son-xi-don-moi.webp",
    },
    {
      id: 3,
      name: "Bảo dưỡng",
      slug: "bao-duong",
      rating: 4.8,
      price: "Từ 300.000đ",
      image: "/images/care-service/bao-duong-xe-may.webp",
    },
    {
      id: 4,
      name: "Sửa chữa",
      slug: "sua-chua",
      rating: 4.6,
      price: "Từ 200.000đ",
      image: "/images/care-service/sua-chua.webp",
    },
    {
      id: 5,
      name: "Thay lốp xe",
      slug: "thay-lop-xe",
      rating: 4.4,
      price: "Từ 150.000đ",
      image: "/images/care-service/sua-chua.webp",
    },
    {
      id: 6,
      name: "Kiểm tra định kỳ",
      slug: "kiem-tra-dinh-ky",
      rating: 4.3,
      price: "Từ 100.000đ",
      image: "/images/care-service/sua-chua.webp",
    },
  ];

  return allServices
    .filter(service => service.slug !== currentType)
    .slice(0, 6);
}
