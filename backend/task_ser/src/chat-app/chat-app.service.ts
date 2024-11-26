import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  private server: Server;

  // Temporary in-memory store for tickets during server runtime
  private readonly tickets: Array<{
    ticketId: string;
    username: string;
    description: string;
    priority: string;
    screenshot: string | null;
    timestamp: string;
  }> = [];

  setServer(server: Server): void {
    console.log('In setServer method');

    if (this.server) {
      console.warn('Socket server is already set up.');
      return;
    }

    this.server = server;

    this.server.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  async handleConnection(socket: Socket): Promise<void> {
    const clientId = socket.id;

    if (this.connectedClients.has(clientId)) {
      console.log(`Client with ID ${clientId} is already connected.`);
      return;
    }

    this.connectedClients.set(clientId, socket);
    console.log(`Client connected: ${clientId}`);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    });

    // Handle new ticket event
    socket.on('new_ticket', (ticketData) => {
      console.log(`Received new ticket from ${clientId}:`, ticketData);

      try {
        const ticketId = new Date().toISOString(); // Use timestamp as a unique ID
        const newTicket = {
          ticketId,
          username: ticketData.username,
          description: ticketData.description,
          priority: ticketData.priority,
          screenshot: ticketData.screenshot || null,
          timestamp: new Date().toISOString(),
        };

        // Store ticket in the temporary tickets array
        this.tickets.push(newTicket);

        // Acknowledge ticket receipt to the sender
        socket.emit('ticket_received', {
          message: 'Your ticket has been received successfully!',
          ticketId,
        });
      } catch (error) {
        console.error('Error processing new ticket:', error);
        socket.emit('error', {
          message: 'There was an error processing your ticket.',
        });
      }
    });
  }
}
