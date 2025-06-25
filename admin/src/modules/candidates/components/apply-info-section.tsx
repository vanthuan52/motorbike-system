import { Card, Form, Input, List } from "antd";
import { FaFileDownload } from "react-icons/fa";
import { Candidate } from "../types";

const ApplyInfoSection = ({ candidate }: { candidate?: Candidate | null }) => {
  return (
    <Card className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Thông tin ứng tuyển</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <Form.Item label="CV" name="cv">
          <Input
            size="large"
            readOnly
            addonAfter={<FaFileDownload />}
            placeholder="Link hoặc tên file CV"
          />
        </Form.Item>

        <Form.Item label="Kinh nghiệm" name="experience">
          <Input.TextArea
            rows={3}
            readOnly
            placeholder="Kinh nghiệm của ứng viên"
          />
        </Form.Item>

        <Form.Item label="Học vấn" name="education">
          <Input.TextArea
            rows={3}
            readOnly
            placeholder="Trình độ học vấn của ứng viên"
          />
        </Form.Item>

        <Form.Item label="Tương tác">
          <List
            bordered
            dataSource={candidate?.interactions || []}
            locale={{ emptyText: "Chưa có tương tác nào" }}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <div>
                  <p className="mb-0 whitespace-pre-line">{item}</p>
                </div>
              </List.Item>
            )}
          />
        </Form.Item>
      </div>
    </Card>
  );
};

export default ApplyInfoSection;
