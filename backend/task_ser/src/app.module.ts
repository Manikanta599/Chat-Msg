import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatAppModule } from './chat-app/chat-app.module';

@Module({
  imports: [ChatAppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
