import { Conversation } from "@/types/Messages";
import { Modal, AutoComplete } from "antd";
interface props {
  isModalOpen: boolean;
  handleModalOk: () => void;
  handleCloseModal: () => void;
  autoCompleteValue: string;
  autoCompleteOptions: { value: string }[];
  setAutoCompleteValue: (value: string) => void;
  handleSelectUser: (value: string) => void;
  conversations: Conversation[];
  selectedUserName: string;
}
export default function ModalCreateNewConv({
  isModalOpen,
  handleModalOk,
  handleCloseModal,
  autoCompleteValue,
  autoCompleteOptions,
  setAutoCompleteValue,
  handleSelectUser,
  conversations,
  selectedUserName,
}: props) {
  return (
    <Modal
      title="Tạo cuộc trò chuyện mới"
      open={isModalOpen}
      onOk={handleModalOk}
      onCancel={handleCloseModal}
      okText="Bắt đầu"
      cancelText="Hủy"
      okButtonProps={{ disabled: !autoCompleteValue }}
    >
      <AutoComplete
        options={autoCompleteOptions}
        value={selectedUserName}
        onChange={setAutoCompleteValue}
        onSelect={handleSelectUser}
        placeholder="Nhập tên người dùng..."
        className="w-full"
        filterOption={(inputValue, option) =>
          conversations
            .find((conv) => conv.user.id === option?.value)
            ?.user.name.toLowerCase()
            .includes(inputValue.toLowerCase()) || false
        }
        allowClear
        maxCount={1}
      />
    </Modal>
  );
}
