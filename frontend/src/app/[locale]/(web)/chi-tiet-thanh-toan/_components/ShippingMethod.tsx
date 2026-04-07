import { useTranslations } from "next-intl";
import { Radio, ConfigProvider } from "antd";
import clsx from "clsx";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function ShippingMethod({
  shipping,
  handleShippingChange,
}: {
  shipping: string;
  handleShippingChange: (value: string) => void;
}) {
  const t = useTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--color-primary-700)",
          colorText: "var(--color-text-primary)",
          colorBgContainer: "var(--color-surface)",
        },
        components: {
          Radio: {
            buttonSolidCheckedActiveBg: "var(--color-primary-700)",
            buttonSolidCheckedBg: "var(--color-primary-700)",
            buttonSolidCheckedColor: "var(--color-primary-700)",
            colorBorder: "var(--color-border)",
          },
        },
      }}
    >
      <h3 className="text-xl font-semibold mb-4 text-text-primary">
        {t("shippingMethod.title")}
      </h3>
      <Radio.Group
        onChange={(e) => handleShippingChange(e.target.value)}
        value={shipping}
        className={clsx(
          "!flex !flex-col sm:!flex-row justify-between gap-4 w-full"
        )}
      >
        <Radio
          value="free"
          className={clsx(
            "border w-full rounded-[var(--radius-xl)] !p-2 flex items-center",
            "!border-border",
            shipping === "free"
              ? "bg-primary-50"
              : "bg-surface"
          )}
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
            background: shipping === "free" ? "var(--color-primary-50)" : "var(--color-surface)",
          }}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">
                {t("shippingMethod.free.title")}
              </span>
              <span className="ml-1 font-semibold text-text-primary">0 vnđ</span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              {t("shippingMethod.free.time")}
            </p>
          </div>
        </Radio>
        <Radio
          value="express"
          className={clsx(
            "border w-full rounded-[var(--radius-xl)] !p-2 flex items-center",
            "!border-border",
            shipping === "express"
              ? "bg-primary-50"
              : "bg-surface"
          )}
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
            background: shipping === "express" ? "var(--color-primary-50)" : "var(--color-surface)",
          }}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">
                {t("shippingMethod.express.title")}
              </span>
              <span className="ml-1 font-semibold text-text-primary">45000 vnđ</span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              {t("shippingMethod.express.time")}
            </p>
          </div>
        </Radio>
      </Radio.Group>
    </ConfigProvider>
  );
}
