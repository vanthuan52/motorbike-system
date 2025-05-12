"use client";
import { Conversation } from "@/types/Messages";
import {
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, Skeleton, Space, Tabs } from "antd";
import type { TabsProps } from "antd";
import UserDetails from "./UserDetails";
interface ChatMediaSidebarProps {
  photos: string[];
  files: string[];
  onToggleMediaSidebar: () => void;
  conversation: Conversation;
  loadingMessages: boolean;
}

export default function ChatMediaSidebar({
  photos,
  files,
  onToggleMediaSidebar,
  conversation,
  loadingMessages,
}: ChatMediaSidebarProps) {
  const items: TabsProps["items"] = [
    {
      key: "photos",
      label: "Hình ảnh",
      children: (
        <Image.PreviewGroup
          preview={{
            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: {
                  onActive,
                  onFlipY,
                  onFlipX,
                  onRotateLeft,
                  onRotateRight,
                  onZoomOut,
                  onZoomIn,
                  onReset,
                },
              }
            ) => (
              <Space size={12} className="toolbar-wrapper">
                <LeftOutlined onClick={() => onActive?.(-1)} />
                <RightOutlined onClick={() => onActive?.(1)} />
                <SwapOutlined rotate={90} onClick={onFlipY} />
                <SwapOutlined onClick={onFlipX} />
                <RotateLeftOutlined onClick={onRotateLeft} />
                <RotateRightOutlined onClick={onRotateRight} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                <UndoOutlined onClick={onReset} />
              </Space>
            ),
          }}
        >
          {loadingMessages ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(photos.length || 6)].map((_, i) => (
                <Skeleton.Image
                  key={i}
                  className="!w-full !h-20 !object-cover !rounded"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {photos.length > 0 ? (
                photos.map((photo, index) => (
                  <Image
                    key={index}
                    src={photo}
                    alt="Shared photo"
                    className="!w-full h-20 object-cover rounded"
                  />
                ))
              ) : (
                <div className="col-span-2 text-gray-500 text-center py-8">
                  Không có hình ảnh
                </div>
              )}
            </div>
          )}
        </Image.PreviewGroup>
      ),
    },
    {
      key: "files",
      label: "File",
      children: (
        <div>
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} className="text-blue-500 underline break-all">
                {file}
              </div>
            ))
          ) : (
            <p className="text-gray-500 py-8 text-center">
              Không có tập tin nào được chia sẻ
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex justify-left items-center mb-4">
        <LeftOutlined
          size={30}
          onClick={onToggleMediaSidebar}
          className="lg:!hidden mr-2"
        />
      </div>
      <UserDetails userDetails={conversation.user} />
      <Tabs defaultActiveKey="photos" items={items} />
    </div>
  );
}
