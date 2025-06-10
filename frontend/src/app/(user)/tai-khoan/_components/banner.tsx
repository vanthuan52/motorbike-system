import { CameraOutlined } from "@ant-design/icons";

export default function Banner() {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md bg-white mb-8 ">
      <img
        src="/images/image-cover.avif"
        alt="Banner bảo dưỡng xe máy"
        className="w-full h-56 object-cover"
      />
      <button className="absolute right-4 bottom-4 bg-white px-3 py-1 rounded-md shadow hover:bg-gray-100 text-sm flex items-center gap-1">
        <CameraOutlined style={{ fontSize: 16 }} />
        <span className="hidden sm:inline">Thêm ảnh bìa</span>
      </button>
    </div>
  );
}
