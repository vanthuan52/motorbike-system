import { Modal, AutoComplete } from "antd";

interface Props {
  isModalOpen: boolean;
  handleModalOk: () => void;
  handleCloseModal: () => void;
  inputValue: string;
  autoCompleteOptions: { value: string; label: React.ReactNode }[];
  setInputValue: (value: string) => void;
  handleSelectUser: (value: string, option: any) => void;
}

export default function ModalCreateNewConv({
  isModalOpen,
  handleModalOk,
  handleCloseModal,
  inputValue,
  autoCompleteOptions,
  setInputValue,
  handleSelectUser,
}: Props) {
  return (
    <Modal
      title="Tạo cuộc trò chuyện mới"
      open={isModalOpen}
      onOk={handleModalOk}
      onCancel={handleCloseModal}
      okText="Bắt đầu"
      cancelText="Hủy"
      okButtonProps={{ disabled: !inputValue }}
    >
      <AutoComplete
        options={autoCompleteOptions}
        value={inputValue}
        onChange={(value) => setInputValue(value)}
        onSelect={handleSelectUser}
        placeholder="Nhập tên người dùng..."
        className="w-full"
        filterOption={(inputValue, option) =>
          (option as any).searchText
            ?.toLowerCase()
            .includes(inputValue.toLowerCase())
        }
        allowClear
      />
    </Modal>
  );
}
