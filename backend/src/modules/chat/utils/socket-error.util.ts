import { Socket } from 'socket.io';
import { ENUM_CHAT_GW_EVENTS } from '../enums/chat.gateway-events.enum';
function emitSocketError(client: Socket, code: string, message: string): void {
  client.emit(ENUM_CHAT_GW_EVENTS.ERROR, {
    code,
    message,
  });
}

export { emitSocketError };
