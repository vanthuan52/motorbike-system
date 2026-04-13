"use client";

import { useTranslations } from "next-intl";
import { User, AtSign, MessagesSquare } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import InputField from "@/components/ui/InputField";
import { TRANSLATION_FILES } from "@/lib/i18n";

type CommentFormProps = {
  form: {
    name: string;
    email: string;
    content: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      content: string;
    }>
  >;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function CommentForm({
  form,
  setForm,
  handleSubmit,
}: CommentFormProps) {
  const t = useTranslations(TRANSLATION_FILES.BLOG_PAGE);

  return (
    <div className="mt-8 sm:mt-10">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        {t("commentForm.title")}
      </h3>
      <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        <InputField
          label={t("commentForm.nameLabel")}
          placeholder={t("commentForm.namePlaceholder")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          icon={<User size={20} />}
        />
        <InputField
          label={t("commentForm.emailLabel")}
          placeholder={t("commentForm.emailPlaceholder")}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          icon={<AtSign size={20} />}
        />
        <InputField
          label={t("commentForm.contentLabel")}
          type="textarea"
          placeholder={t("contentPlaceholder")}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          icon={<MessagesSquare size={20} />}
          rows={2}
        />

        <Button
          label={t("commentForm.submit")}
          type="submit"
          className="w-52 h-[45px] cursor-pointer"
        />
      </form>
    </div>
  );
}
