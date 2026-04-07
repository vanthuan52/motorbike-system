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

export default function PickupInfoSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("form.address")}</FormLabel>
          <FormControl>
            <Input placeholder={t("form.addressPlaceholder")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
