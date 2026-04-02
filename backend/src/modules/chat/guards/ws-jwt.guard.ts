import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthUtil } from '@/modules/auth/utils/auth.util';

/**
 * WebSocket JWT Guard
 *
 * Validates JWT access token from WebSocket handshake.
 * Token can be provided via:
 * - handshake.auth.token
 * - handshake.headers.authorization (Bearer <token>)
 *
 * On success, attaches userId and sessionId to client.data
 */
@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authUtil: AuthUtil) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    try {
      const token = this.extractToken(client);

      if (!token) {
        throw new WsException('Authentication token is required');
      }

      const payload = this.authUtil.payloadToken(token);

      if (!payload || !payload.userId) {
        throw new WsException('Invalid authentication token');
      }

      // Attach user data to socket for downstream handlers
      client.data.userId = payload.userId;
      client.data.sessionId = payload.sessionId;

      return true;
    } catch {
      client.disconnect();
      return false;
    }
  }

  private extractToken(client: Socket): string | null {
    // Priority 1: handshake.auth.token (Socket.IO v4+ standard)
    const authToken = client.handshake?.auth?.token;
    if (authToken) {
      return authToken;
    }

    // Priority 2: Authorization header
    const authorization = client.handshake?.headers?.authorization;
    if (authorization) {
      const parts = authorization.split(' ');
      return parts.length >= 2 ? parts[1] : null;
    }

    return null;
  }
}
