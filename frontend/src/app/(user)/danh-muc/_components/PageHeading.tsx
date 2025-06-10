import { motion } from "framer-motion";

const stats = [
  { label: "Phụ tùng xe số", value: "120+" },
  { label: "Phụ tùng xe tay ga", value: "80+" },
  { label: "Phụ tùng xe côn", value: "60+" },
  { label: "Phụ tùng chính hãng", value: "40+" },
  { label: "Phụ tùng độ xe", value: "30+" },
];
const title = "Bộ sưu tập phụ tùng xe máy chất lượng";
const description =
  " Khám phá các danh mục phụ tùng đa dạng cho mọi dòng xe máy. Đảm bảo chính hãng, chất lượng và giá tốt cho mọi nhu cầu sửa chữa, bảo dưỡng hoặc nâng cấp xe của bạn.";
export default function PageHeading() {
  return (
    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-white max-w-xl">{description}</p>
      </motion.div>

      <motion.div
        className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:flex lg:flex-wrap lg:justify-end"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center text-white min-w-[100px]"
          >
            <span className="text-xl md:text-2xl font-bold">{item.value}</span>
            <span className="text-sm text-center">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
