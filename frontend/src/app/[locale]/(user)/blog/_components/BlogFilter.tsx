import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface BlogFilterProps {
  uniqueTags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}

export default function BlogFilter({
  uniqueTags,
  selectedTag,
  setSelectedTag,
}: BlogFilterProps) {
  const t = useTranslations("blogPage.filter");
  return (
    <section className="py-5">
      <div className="container text-center">
        <div className="flex flex-wrap gap-3 mb-4">
          {uniqueTags.map((tag, idx) => {
            const isActive = tag === selectedTag;
            return (
              <button
                key={idx}
                onClick={() =>
                  isActive ? setSelectedTag(t("all")) : setSelectedTag(tag)
                }
                className={`flex items-center gap-2 px-4 py-1.5 rounded-[20px] border text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer
            ${
              isActive
                ? "bg-[#FEDCB7] text-black border-[#FB7B0D] hover:bg-orange-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500"
            }`}
              >
                {tag}
                {isActive && (
                  <span className="p-1 rounded-full bg-[#FB7B0D] flex items-center justify-center">
                    <X size={14} className="text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
