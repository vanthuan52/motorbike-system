import { useTranslations } from "next-intl";
import Image from "next/image";
import { TRANSLATION_FILES } from "@/lib/i18n";

type Comment = {
  id: string | number;
  avatar: string;
  name: string;
  date: string;
  title: string;
  content: string;
  likes: number;
};

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  const t = useTranslations(TRANSLATION_FILES.BLOG_PAGE);

  return (
    <div className="mt-10 sm:mt-14">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        {t("commentsList.title")}
      </h2>
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-3 sm:gap-4">
            <Image
              src={c.avatar}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h4 className="font-medium">
                {c.name}{" "}
                <span className="text-xs sm:text-sm text-gray-400">
                  ({c.date})
                </span>
              </h4>
              <p className="text-xs sm:text-sm font-semibold">{c.title}</p>
              <p className="text-gray-700">{c.content}</p>
              <span className="text-xs text-gray-500">
                👍 {c.likes} {t("commentsList.likes")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
