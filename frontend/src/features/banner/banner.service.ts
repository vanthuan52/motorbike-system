import { Banner, BannerListResponse, ENUM_BANNER_STATUS } from "./types";

/**
 * Mock banner data — will be replaced by real API calls later.
 */
const MOCK_BANNERS: Banner[] = [
  {
    _id: "banner-1",
    title: "Dịch Vụ Bảo Dưỡng Xe Máy Chuyên Nghiệp",
    subtitle:
      "Đội ngũ kỹ thuật viên giàu kinh nghiệm — Phụ tùng chính hãng — Bảo hành dài hạn",
    image: "/images/banners/banner-0.jpg",
    link: "/dich-vu",
    linkText: "Khám phá dịch vụ",
    order: 1,
    status: ENUM_BANNER_STATUS.ACTIVE,
    createdAt: new Date().toISOString() as unknown as Date,
    updatedAt: new Date().toISOString() as unknown as Date,
  },
];

const bannerServices = {
  getBanners: async (): Promise<BannerListResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      statusCode: 200,
      message: "Success",
      data: MOCK_BANNERS,
    };
  },
};

export default bannerServices;
