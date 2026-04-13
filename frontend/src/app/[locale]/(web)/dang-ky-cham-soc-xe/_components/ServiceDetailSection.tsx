import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";

import { TRANSLATION_FILES } from "@/lib/i18n";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

function generateTimeSlots(
  startHour: number,
  endHour: number,
  interval: number
) {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      if (h === endHour && m > 0) break;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

export default function ServiceDetailSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const { control } = useFormContext();

  const timeSlots = useMemo(() => generateTimeSlots(6, 19, 15), []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.date")} <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.timeSlot")} <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-11 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-base text-text-primary shadow-[var(--shadow-inner)] outline-none appearance-none placeholder:text-text-muted hover:border-border-strong focus-visible:border-primary-500 focus-visible:shadow-[var(--shadow-focus-ring)] focus-visible:border-2 md:text-sm aria-invalid:border-error aria-invalid:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] aria-invalid:bg-error-bg"
                >
                  <option value="" disabled>
                    -- Chọn khung giờ --
                  </option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <p className="text-xs text-text-muted mt-1">
        {t("form.timeSlotExtra")}
      </p>
    </>
  );
}
