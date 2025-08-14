import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  return socket;
}

export function connectSocket(userId: string) {
  if (!userId) return null;
  if (socket && socket.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "/", {
    query: { userId },
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
