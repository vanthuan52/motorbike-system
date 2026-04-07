import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";

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
  const t = useTranslations(TRANSLATION_FILES.BLOG_PAGE);
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
                  isActive
                    ? setSelectedTag(t("filter.all"))
                    : setSelectedTag(tag)
                }
                className={`flex items-center gap-2 px-4 py-1.5 rounded-[20px] border text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer
            ${
              isActive
                ? "bg-primary-100 text-primary-800 border-primary-700 hover:bg-primary-200"
                : "bg-surface text-text-secondary border-border hover:border-primary-400 hover:text-primary-700"
            }`}
              >
                {tag}
                {isActive && (
                  <span className="p-1 rounded-full bg-primary-700 flex items-center justify-center">
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
