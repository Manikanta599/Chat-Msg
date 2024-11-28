import { WebSocketGateway, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';  // Import Server and Socket from 'socket.io'
import { SocketService } from './chat-app.service';

@WebSocketGateway({
    cors: {
        origin: '*',  
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, 
    },
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;  // Correct type for server

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    this.socketService.setServer(this.server);  // Set the server in SocketService
    this.socketService.handleConnection(socket);
  }

  // Implement other Socket.IO event handlers and message handlers
}
