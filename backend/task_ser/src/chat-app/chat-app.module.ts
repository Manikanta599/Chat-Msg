import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
  // Import the gateway
  // import { ChatGateway } from './chat-app.gateway';

  import { SocketGateway } from './chat-app.gateway';
import { SocketService } from './chat-app.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway,SocketService],  // Add the gateway to providers
})
export class ChatAppModule {} 
