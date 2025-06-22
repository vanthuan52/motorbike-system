"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Checkbox, Button, Card, Popover } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

const partLabels: Record<string, string> = {
  glass: "Kính",
  fork: "Phuộc",
  brake: "Phanh",
  oil_filter: "Lọc dầu",
  air_filter: "Lọc gió",
  saddle: "Yên xe",
  light: "Đèn",
};

export default function ToDoListPage() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loadingButton, setLoadingButton] = useState(false);
  useEffect(() => {
    const data = localStorage.getItem("maintenance_before_data");
    if (data) {
      const parsed = JSON.parse(data);
      setHistoryData(parsed);
      const initChecked: Record<string, boolean> = {};
      Object.keys(partLabels).forEach((key) => {
        if (parsed.details[key]) initChecked[key] = false;
      });
      setChecked(initChecked);
    }
    return () => {
      localStorage.removeItem("maintenance_before_data");
    };
  }, []);

  const handleCheck = (key: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [key]: value }));
  };

  const handleFinish = () => {
    setLoadingButton(true);
    localStorage.setItem("note_after_maintenance", "note_after_maintenance");
    setTimeout(() => {
      setLoadingButton(false);
      router.back();
    }, 500);
  };

  if (!historyData) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      <CustomLink onClick={() => router.back()}>
        <Button icon={<FaArrowLeft />}> Quay lại</Button>
      </CustomLink>
      <Card title="Danh sách công việc" className="mx-auto !mt-8">
        <Form layout="vertical">
          {Object.keys(partLabels).map((key) =>
            historyData.details[key] ? (
              <Form.Item key={key}>
                <Checkbox
                  checked={checked[key]}
                  onChange={(e) => handleCheck(key, e.target.checked)}
                  className="!text-lg"
                >
                  {partLabels[key]}
                </Checkbox>
                {historyData.details[key].note && (
                  <Popover
                    content={historyData.details[key].note}
                    title="Ghi chú"
                    trigger="click"
                    placement="right"
                    rootClassName="!text-lg"
                  >
                    <Button
                      type="link"
                      size="small"
                      icon={<BiInfoCircle />}
                      className="ml-2 !text-xl"
                    >
                      Xem ghi chú
                    </Button>
                  </Popover>
                )}
              </Form.Item>
            ) : null
          )}
          <Form.Item>
            <CustomLink>
              <Button
                type="primary"
                onClick={handleFinish}
                disabled={
                  Object.keys(checked).length === 0 ||
                  Object.values(checked).some((v) => !v)
                }
                loading={loadingButton}
              >
                Hoàn thành
              </Button>
            </CustomLink>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
