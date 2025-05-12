import type { Metadata } from "next";
import Messages from "./components/Messages";

export const metadata: Metadata = {
  title: "Tin nhắn | Motorbike",
  description: "Trang tin nhắn hệ thống Motorbike",
};
export default function MessagesPage() {
  return <Messages />;
}
