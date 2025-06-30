"use client";

import {
  Input,
  Form,
  Upload,
  Button,
  Radio,
  ConfigProvider,
  theme,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

const { Dragger } = Upload;

export default function ApplicationForm() {
  const t = useTranslations(TRANSLATION_FILES.HIRING_DETAIL);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#000000",
          colorText: "#1f1f1f",
          colorBgContainer: "#ffffff",
          colorBorder: "#d9d9d9",
          borderRadius: 8,
          fontSize: 16,
        },
      }}
    >
      <Form layout="vertical" className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="firstName"
            label={t("applicationForm.firstName")}
            rules={[{ required: true, message: t("validation.firstName") }]}
          >
            <Input size="large" placeholder={t("applicationForm.firstName")} />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={t("applicationForm.lastName")}
            rules={[
              {
                required: true,
                message: t("applicationForm.validation.lastName"),
              },
            ]}
          >
            <Input size="large" placeholder={t("applicationForm.lastName")} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label={t("applicationForm.email")}
            rules={[
              {
                required: true,
                type: "email",
                message: t("applicationForm.validation.email"),
              },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t("applicationForm.phone")}
            rules={[
              {
                required: true,
                message: t("applicationForm.validation.phone"),
              },
            ]}
          >
            <Input size="large" placeholder={t("applicationForm.phone")} />
          </Form.Item>
        </div>

        <Form.Item name="message" label={t("applicationForm.message")}>
          <Input.TextArea
            rows={4}
            placeholder={t("applicationForm.messagePlaceholder")}
            size="large"
          />
        </Form.Item>

        <Form.Item name="resume" label={t("applicationForm.resume")}>
          <Dragger maxCount={1} accept=".pdf,.doc,.docx" height={150}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-sm text-gray-600">
              {t("uploadInstruction")}{" "}
              <span className="text-blue-500 underline">
                {t("applicationForm.chooseFile")}
              </span>
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item
          name="experience"
          label={t("experience")}
          rules={[
            {
              required: true,
              message: t("applicationForm.validation.experience"),
            },
          ]}
        >
          <Radio.Group size="large" rootClassName="!flex flex-col !space-y-2">
            <Radio value="0-2">{t("applicationForm.expOptions.0_2")}</Radio>
            <Radio value="3-5">{t("applicationForm.expOptions.3_5")}</Radio>
            <Radio value=">5">{t("applicationForm.expOptions.more_5")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-black hover:bg-gray-800 px-6"
          >
            {t("applicationForm.submit")}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
}
