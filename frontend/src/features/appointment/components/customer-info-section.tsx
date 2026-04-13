import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { TRANSLATION_FILES } from "@/lib/i18n";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

export default function CustomerInfoSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.name")} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder={t("form.namePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("form.phone")} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder={t("form.phonePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
