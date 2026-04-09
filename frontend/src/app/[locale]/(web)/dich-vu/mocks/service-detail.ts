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

export type ServiceType = "dai-tu-dong-co" | "son-xi-don-moi" | "bao-duong" | "sua-chua";

export type RelatedService = {
  id: number;
  name: string;
  slug: string;
  type: ServiceType;
  rating: number;
  price: string;
  image: string;
  description: string;
};

export function getRelatedServices(currentType: string): RelatedService[] {
  const allServices: RelatedService[] = [
    {
      id: 1,
      name: "Đại tu động cơ toàn bộ",
      slug: "dai-tu-dong-co",
      type: "dai-tu-dong-co",
      rating: 4.5,
      price: "2500000",
      image: "/images/care-service/dai-tu-dong-co.webp",
      description: "Tháo rời, kiểm tra và thay thế toàn bộ chi tiết hư hỏng trong động cơ.",
    },
    {
      id: 2,
      name: "Sơn-xi-dọn mới toàn xe",
      slug: "son-xi-don-moi",
      type: "son-xi-don-moi",
      rating: 4.7,
      price: "1800000",
      image: "/images/care-service/son-xi-don-moi.webp",
      description: "Phục hồi màu sơn nguyên bản, xi mạ sáng bóng, dọn sạch toàn diện.",
    },
    {
      id: 3,
      name: "Bảo dưỡng định kỳ",
      slug: "bao-duong",
      type: "bao-duong",
      rating: 4.8,
      price: "300000",
      image: "/images/care-service/bao-duong-xe-may.webp",
      description: "Thay dầu, kiểm tra phanh, lốp, đèn và các hệ thống quan trọng.",
    },
    {
      id: 4,
      name: "Sửa chữa tổng quát",
      slug: "sua-chua",
      type: "sua-chua",
      rating: 4.6,
      price: "200000",
      image: "/images/care-service/sua-chua.webp",
      description: "Chẩn đoán và sửa chữa mọi sự cố từ nhỏ đến phức tạp.",
    },
    {
      id: 5,
      name: "Thay nhớt cao cấp",
      slug: "bao-duong",
      type: "bao-duong",
      rating: 4.9,
      price: "250000",
      image: "/images/care-service/bao-duong-xe-may.webp",
      description: "Sử dụng nhớt nhập khẩu chính hãng, bảo vệ động cơ tối đa.",
    },
    {
      id: 6,
      name: "Thay lốp xe chính hãng",
      slug: "sua-chua",
      type: "sua-chua",
      rating: 4.4,
      price: "350000",
      image: "/images/care-service/sua-chua.webp",
      description: "Lốp chính hãng Michelin, Dunlop — lắp đặt nhanh gọn tại chỗ.",
    },
    {
      id: 7,
      name: "Đại tu hộp số",
      slug: "dai-tu-dong-co",
      type: "dai-tu-dong-co",
      rating: 4.3,
      price: "1500000",
      image: "/images/care-service/dai-tu-dong-co.webp",
      description: "Tháo rời, vệ sinh và thay thế bi, bánh răng hộp số bị mòn.",
    },
    {
      id: 8,
      name: "Sơn phục hồi dàn áo",
      slug: "son-xi-don-moi",
      type: "son-xi-don-moi",
      rating: 4.6,
      price: "1200000",
      image: "/images/care-service/son-xi-don-moi.webp",
      description: "Sơn lại các chi tiết dàn áo bị trầy xước, bạc màu theo thời gian.",
    },
    {
      id: 9,
      name: "Kiểm tra tổng quát 21 hạng mục",
      slug: "bao-duong",
      type: "bao-duong",
      rating: 4.7,
      price: "150000",
      image: "/images/care-service/bao-duong-xe-may.webp",
      description: "Kiểm tra toàn diện 21 hạng mục quan trọng, báo cáo chi tiết.",
    },
    {
      id: 10,
      name: "Sửa chữa hệ thống điện",
      slug: "sua-chua",
      type: "sua-chua",
      rating: 4.5,
      price: "400000",
      image: "/images/care-service/sua-chua.webp",
      description: "Chẩn đoán và khắc phục lỗi điện, đèn, còi, khởi động.",
    },
    {
      id: 11,
      name: "Xi mạ phụ tùng inox",
      slug: "son-xi-don-moi",
      type: "son-xi-don-moi",
      rating: 4.8,
      price: "800000",
      image: "/images/care-service/son-xi-don-moi.webp",
      description: "Xi mạ chrome, niken cho ống xả, gương, tay lái sáng bóng như mới.",
    },
    {
      id: 12,
      name: "Căn chỉnh phanh đĩa",
      slug: "sua-chua",
      type: "sua-chua",
      rating: 4.4,
      price: "180000",
      image: "/images/care-service/sua-chua.webp",
      description: "Kiểm tra, thay má phanh và căn chỉnh hệ thống phanh đĩa chuẩn xác.",
    },
  ];

  return allServices
    .filter(service => service.slug !== currentType)
    .slice(0, 12);
}
