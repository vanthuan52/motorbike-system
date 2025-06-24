import { Button, Card, Form, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ENUM_PAGE_MODE } from "@/types/app.type";
type RecruitmentRequirementSectionProps = {
  mode: ENUM_PAGE_MODE;
};
const RecruitmentRequirementSection = ({
  mode,
}: RecruitmentRequirementSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Yêu cầu tuyển dụng</h2>
      <div className="mt-4">
        <Form.List name="requirements">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} className="flex gap-2 mb-2">
                  <Form.Item
                    name={name}
                    className="w-full"
                    rules={[
                      { required: true, message: "Vui lòng nhập yêu cầu" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập yêu cầu công việc"
                      size="large"
                      disabled={isDisabled}
                    />
                  </Form.Item>
                  <Button
                    danger
                    onClick={() => remove(name)}
                    icon={<DeleteOutlined />}
                  />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  disabled={isDisabled}
                >
                  Thêm yêu cầu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    </Card>
  );
};

export default RecruitmentRequirementSection;
