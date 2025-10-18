import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Ticket {
  ticketId: string;
  subject: string;
  status: string;
  logs: LogEntry[];
}

interface LogEntry {
  message: string;
  agentName: string;
  timestamp: number;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tickets, setTickets] = useState<Map<string, Ticket>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // In production, connect to same origin. In development, use localhost:3001
    const serverUrl = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin;
    const socketInstance = io(serverUrl);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socketInstance.on('ticket_created', (data: { ticketId: string; subject: string; status: string }) => {
      setTickets(prev => {
        const updated = new Map(prev);
        updated.set(data.ticketId, {
          ticketId: data.ticketId,
          subject: data.subject,
          status: data.status,
          logs: []
        });
        return updated;
      });
    });

    socketInstance.on('log_update', (data: { ticketId: string; message: string; agentName: string }) => {
      setTickets(prev => {
        const updated = new Map(prev);
        const ticket = updated.get(data.ticketId);
        if (ticket) {
          ticket.logs.push({
            message: data.message,
            agentName: data.agentName,
            timestamp: Date.now()
          });
          updated.set(data.ticketId, { ...ticket });
        }
        return updated;
      });
    });

    socketInstance.on('ticket_status_update', (data: { ticketId: string; status: string }) => {
      setTickets(prev => {
        const updated = new Map(prev);
        const ticket = updated.get(data.ticketId);
        if (ticket) {
          ticket.status = data.status;
          updated.set(data.ticketId, { ...ticket });
        }
        return updated;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const createTicket = (subject: string, description?: string) => {
    if (socket && connected) {
      socket.emit('create_ticket', { 
        ticket_subject: subject,
        ticket_description: description 
      });
    }
  };

  return {
    connected,
    tickets: Array.from(tickets.values()),
    createTicket
  };
}
