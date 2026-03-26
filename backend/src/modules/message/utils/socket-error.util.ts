import { Socket } from 'socket.io';
import { EnumMessageGwEvents } from '../enums/message.gateway-events.enum';

function emitSocketError(client: Socket, code: string, message: string): void {
  client.emit(EnumMessageGwEvents.error, {
    code,
    message,
  });
}

export { emitSocketError };
