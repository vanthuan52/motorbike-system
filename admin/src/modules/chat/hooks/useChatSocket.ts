import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { User } from "@/modules/user/types";
import {
  ENUM_CHAT_GW_EVENTS,
  ENUM_MESSAGE_STATUS,
  MessageSocket,
} from "../types";
import { chatActions } from "../store/chat-slice";
import { APP_CONFIG } from "@/constants/config";
function debounce(fn: (...args: any[]) => void, wait = 300) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
export function useChatSocket({
  conversationId,
  userId,
  users,
}: {
  conversationId?: string | null;
  userId?: string;
  users?: User[] | null;
}) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<MessageSocket[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  const currentTime = dayjs().format("h:mm A");

  // Socket setup
  useEffect(() => {
    if (!userId) return;

    const url = APP_CONFIG.BASE_SOCKET_URL;

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
  }, [messages, isTyping]);

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
      messages && messages.length > 0 ? messages[messages.length - 1] : null;

    if (
      lastMsg &&
      lastMsg.sender &&
      lastMsg.sender !== userId &&
      lastMsg.status !== ENUM_MESSAGE_STATUS.READ &&
      lastMsg._id
    ) {
      dispatch(
        chatActions.messageMarkAsReadMessage({
          messageId: lastMsg._id,
          status: ENUM_MESSAGE_STATUS.READ,
        })
      );
    }
  }, [messages, userId, dispatch]);

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
    typingUserId,
    setTypingUserId,
    endRef,
    currentTime,
    handleSendMessage,
    onInputChange,
  };
}
