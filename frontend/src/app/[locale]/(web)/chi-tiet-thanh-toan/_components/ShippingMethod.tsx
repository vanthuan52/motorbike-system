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
          colorPrimary: "#000",
          colorText: "#fff",
          colorBgContainer: "#fff",
        },
        components: {
          Radio: {
            buttonSolidCheckedActiveBg: "black",
            buttonSolidCheckedBg: "black",
            buttonSolidCheckedColor: "black",
            colorBorder: "black",
          },
        },
      }}
    >
      <h3 className="text-xl font-semibold mb-4">
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
            "border w-full rounded-xl !p-2 flex items-center",
            "!border-gray-300 text-[--ant-colorText]",
            shipping === "free"
              ? "bg-gray-100 text-black"
              : "bg-white text-black"
          )}
          style={{
            borderColor: "black",
            color: "black",
            background: shipping === "free" ? "#f3f4f6" : "#fff",
          }}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {t("shippingMethod.free.title")}
              </span>
              <span className="ml-1 font-semibold">0 vnđ</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t("shippingMethod.free.time")}
            </p>
          </div>
        </Radio>
        <Radio
          value="express"
          className={clsx(
            "border w-full rounded-xl !p-2 flex items-center",
            "!border-gray-300 text-[--ant-colorText]",
            shipping === "free"
              ? "bg-gray-100 text-black"
              : "bg-white text-black"
          )}
          style={{
            borderColor: "black",
            color: "black",
            background: shipping === "express" ? "#f3f4f6" : "#fff",
          }}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {t("shippingMethod.express.title")}
              </span>
              <span className="ml-1 font-semibold">45000 vnđ</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t("shippingMethod.express.time")}
            </p>
          </div>
        </Radio>
      </Radio.Group>
    </ConfigProvider>
  );
}
