export const messageUtils = {
  isPreviousDay: (timestamp: string, today: string): boolean => {
    const messageDate = new Date(timestamp).toLocaleDateString();
    return messageDate !== today;
  },

  formatReadTime: (readAt?: string): string => {
    if (!readAt) return "";
    return new Date(readAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatSendTime: (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  getAvatar: (
    senderId: string,
    conversation: { user: { id: string; avatar: string } }
  ): string => {
    if (senderId === "2") {
      return "";
    }
    return senderId === conversation.user.id ? conversation.user.avatar : "";
  },

  getMessageStatus: (
    senderId: string,
    isRead: boolean | undefined,
    readAt: string | undefined,
    timestamp: string,
    today: string
  ): { text: string; showCheck: boolean } | null => {
    if (senderId !== "2") return null;
    if (!isRead) {
      return { text: "Đã gửi", showCheck: false };
    }
    if (messageUtils.isPreviousDay(timestamp, today)) {
      return { text: messageUtils.formatReadTime(readAt), showCheck: true };
    }
    return null;
  },
};
