import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { debounce } from "@/utils/debounce.helper";
import {
  ENUM_CHAT_GW_EVENTS,
  ENUM_MESSAGE_STATUS,
  Message,
  MessageSocket,
} from "@/features/chat/types";
import { chatActions } from "@/features/chat/store/chat-slice";
import { User } from "@/features/user/types";

export function useChatBox({
  type,
  conversationId,
  userId,
  users,
  messageList,
}: {
  type?: "support" | "chat";
  conversationId?: string | null;
  userId?: string;
  users?: User[] | null;
  messageList?: Message[] | null;
}) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<MessageSocket[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  const currentTime = dayjs().format("h:mm A");

  // Filter messages
  const filteredMessages =
    type === "support"
      ? messages.filter((msg) => msg.sender === "bot")
      : messages;

  const filteredMessageList =
    type === "support"
      ? (messageList || []).filter((msg) =>
          typeof msg.sender === "string"
            ? msg.sender === "bot"
            : (msg.sender as any)?._id === "bot"
        )
      : messageList;

  // Socket setup
  useEffect(() => {
    if (!userId) return;

    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "/";

    const socket = io(url, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {});

    socket.on(ENUM_CHAT_GW_EVENTS.NEW_MESSAGE, (payload: any) => {
      if (conversationId) {
        dispatch(
          chatActions.listMessageByConversation({
            conversationId,
            queries: { page: 1, perPage: 1000 },
          })
        );
      }
    });

    socket.on(
      ENUM_CHAT_GW_EVENTS.TYPING_STATUS,
      (payload: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
        userName?: string;
      }) => {
        if (
          payload.userId !== userId &&
          payload.conversationId === conversationId
        ) {
          setIsTyping(payload.isTyping);
          setTypingUserId(payload.isTyping ? payload.userId : null);
        }
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;
    socket.emit(ENUM_CHAT_GW_EVENTS.JOIN_CONVERSATION, { conversationId });
  }, [conversationId]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessageList, isTyping]);

  useEffect(() => {
    if (!socketRef.current || !conversationId || !userId) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender !== userId) {
      socketRef.current.emit(ENUM_CHAT_GW_EVENTS.READ_MESSAGE, {
        conversationId,
        messageId: lastMsg._id,
      });
    }
  }, [messages, conversationId, userId]);
  // Mark as read
  useEffect(() => {
    const lastMsg =
      filteredMessageList && filteredMessageList.length > 0
        ? filteredMessageList[filteredMessageList.length - 1]
        : null;

    if (
      lastMsg &&
      lastMsg.sender &&
      lastMsg.sender !== userId &&
      lastMsg.status !== ENUM_MESSAGE_STATUS.READ
    ) {
      dispatch(
        chatActions.messageMarkAsReadMessage({
          messageId: lastMsg._id,
          status: ENUM_MESSAGE_STATUS.READ,
        })
      );
    }
  }, [filteredMessageList, userId, dispatch]);

  // Typing
  const emitTyping = useRef(
    debounce((isTypingVal: boolean) => {
      const socket = socketRef.current;
      if (!socket || !conversationId) return;
      socket.emit(ENUM_CHAT_GW_EVENTS.TYPING, {
        conversationId,
        isTyping: isTypingVal,
      });
    }, 300)
  ).current;

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    setInput("");

    const socket = socketRef.current;
    if (socket && conversationId && users) {
      socket.emit(ENUM_CHAT_GW_EVENTS.SEND_MESSAGE, {
        sender: userId,
        receiver: users[0]?._id,
        conversation: conversationId,
        content: text,
        messageType: "text",
      });
    } else {
      const localMsg: MessageSocket = {
        _id: `local-${Date.now()}`,
        sender: userId || "user",
        text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, localMsg]);
      setTimeout(() => {
        const botMsg: MessageSocket = {
          sender: "bot",
          text: "Thanks — we'll get back to you shortly!",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 800);
    }
  };

  const handleEmojiClick = (emoji: any) => {
    setInput((prev) => prev + emoji.emoji);
  };

  const onInputChange = (value: string) => {
    setInput(value);

    emitTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1200);
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isTyping,
    setIsTyping,
    showEmojiPicker,
    setShowEmojiPicker,
    typingUserId,
    setTypingUserId,
    endRef,
    currentTime,
    filteredMessages,
    filteredMessageList,
    handleSendMessage,
    handleEmojiClick,
    onInputChange,
  };
}
