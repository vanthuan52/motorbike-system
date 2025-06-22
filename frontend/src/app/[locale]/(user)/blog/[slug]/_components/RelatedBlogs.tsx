import { useTranslations } from "next-intl";
import Image from "next/image";

type RelatedBlog = {
  id: string | number;
  image: string;
  title: string;
  date: string;
  author: string;
};

interface RelatedBlogsProps {
  relatedBlogs: RelatedBlog[];
}

export default function RelatedBlogs({ relatedBlogs }: RelatedBlogsProps) {
  const t = useTranslations("blogPage.relatedBlogs");

  return (
    <div className="mt-10 sm:mt-14">
      <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedBlogs.map((rel) => (
          <div
            key={rel.id}
            className="rounded-[30px] hover:shadow cursor-pointer"
          >
            <Image
              src={rel.image}
              alt={rel.title}
              width={400}
              height={100}
              className="rounded-[30px] mb-2 object-cover h-[150px] w-full"
            />
            <div className="p-3">
              <h3 className="font-medium line-clamp-2">{rel.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {rel.date} • {rel.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
