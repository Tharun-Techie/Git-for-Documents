import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as Y from 'yjs';
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils';
import { IncomingMessage } from 'http';

@WebSocketGateway(3001, {
  path: '/collaboration',
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: IncomingMessage) {
    const docName = request.url?.split('/').pop() || 'default-doc';
    console.log(`User connected to doc: ${docName}`);
    
    // y-websocket handles the protocol (syncing, awareness, etc.)
    setupWSConnection(connection, request, {
      docName,
      gc: true,
    });
  }

  handleDisconnect(connection: WebSocket) {
    console.log('User disconnected');
  }
}
