import { Socket } from 'socket.io';
import { ENUM_MESSAGE_GW_EVENTS } from '../enums/message.gateway-events.enum';

function emitSocketError(client: Socket, code: string, message: string): void {
  client.emit(ENUM_MESSAGE_GW_EVENTS.ERROR, {
    code,
    message,
  });
}

export { emitSocketError };
