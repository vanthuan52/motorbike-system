import {
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
  HiOutlineStar,
} from "react-icons/hi";
import { FaCarSide, FaMapMarkedAlt } from "react-icons/fa";

const features = [
  {
    title: "Đặt lịch",
    icon: <HiOutlineClipboardList className="w-6 h-6" />,
    color: "bg-blue-100",
  },
  {
    title: "Xe của tôi",
    icon: <FaCarSide className="w-6 h-6" />,
    color: "bg-green-100",
  },
  {
    title: "Trạm gần tôi",
    icon: <FaMapMarkedAlt className="w-6 h-6" />,
    color: "bg-yellow-100",
  },
  {
    title: "Lịch sử",
    icon: <FaMapMarkedAlt className="w-6 h-6" />,
    color: "bg-purple-100",
  },
  {
    title: "Hỗ trợ",
    icon: <HiOutlineChatAlt2 className="w-6 h-6" />,
    color: "bg-pink-100",
  },
];

const history = [
  { date: "10/05/2025", vehicle: "Toyota Vios", station: "AutoCare Hà Nội" },
  { date: "02/04/2025", vehicle: "Kia Morning", station: "AutoZone Sài Gòn" },
];

const promotions = [
  "Giảm 20% khi đặt lịch online",
  "Miễn phí kiểm tra 20 hạng mục",
  "Tặng nước rửa kính cho khách mới",
];

const reviews = [
  {
    name: "Anh Tuấn",
    comment: "Dịch vụ chuyên nghiệp, rất hài lòng!",
    rating: 5,
  },
  {
    name: "Chị Hương",
    comment: "Nhân viên thân thiện, nhanh chóng.",
    rating: 4,
  },
];

export default function MobileHomeScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="pt-10 md:pt-4 px-4 pb-12 max-w-screen-md mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <div className={`p-3 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-sm mt-2">{item.title}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Lịch sử bảo dưỡng
          </h2>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 shadow">
                <p className="text-sm text-gray-700">
                  Xe <strong>{item.vehicle}</strong> đã bảo dưỡng ngày{" "}
                  <strong>{item.date}</strong> tại{" "}
                  <strong>{item.station}</strong>.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Khuyến mãi
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {promotions.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Trạm gần bạn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">AutoCare Hà Nội</p>
              <p className="text-sm text-gray-500">Cách bạn 2.3km</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">FastFix Center</p>
              <p className="text-sm text-gray-500">Cách bạn 1.8km</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Cảm nhận khách hàng
          </h2>
          <div className="space-y-3">
            {reviews.map((r, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl shadow">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{r.name}</span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <HiOutlineStar key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
