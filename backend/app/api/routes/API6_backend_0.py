// websocket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';

// Interface for DJ availability message
interface AvailabilityMessage {
  djId: string;
  isAvailable: boolean;
  timestamp: Date;
}

// Map to track active WebSocket connections
const activeConnections = new Map<string, WebSocket>();

// Initialize WebSocket server
export function initializeWebSocketServer(server: Server): void {
  const wss = new WebSocketServer({ server });

  // Handle new WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    const connectionId = uuidv4(); // Generate a unique ID for the connection
    activeConnections.set(connectionId, ws);

    console.log(`New WebSocket connection established: ${connectionId}`);

    // Handle incoming messages
    ws.on('message', (message: string) => {
      try {
        const parsedMessage: AvailabilityMessage = JSON.parse(message);
        console.log(`Received availability update:`, parsedMessage);

        // Broadcast the availability update to all connected clients
        broadcastAvailabilityUpdate(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    // Handle connection closure
    ws.on('close', () => {
      activeConnections.delete(connectionId);
      console.log(`WebSocket connection closed: ${connectionId}`);
    });
  });

  console.log('WebSocket server initialized');
}

// Function to broadcast availability updates to all connected clients
function broadcastAvailabilityUpdate(message: AvailabilityMessage): void {
  const broadcastMessage = JSON.stringify(message);
  activeConnections.forEach((ws) => {
    try {
      ws.send(broadcastMessage);
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  });
}

// Example usage
// const httpServer = require('http').createServer();
// initializeWebSocketServer(httpServer);
// httpServer.listen(8080, () => console.log('Server running on port 8080'));
