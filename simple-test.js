// Simple connectivity test
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('✅ Connected to server!');
  console.log('🧪 Testing phishing ticket...');
  
  socket.emit('create_ticket', { 
    ticket_subject: 'Suspicious phishing email received from unknown sender' 
  });
});

socket.on('ticket_created', (data) => {
  console.log('🎫 Ticket created:', data.ticketId);
});

socket.on('log_update', (data) => {
  console.log(`📋 ${data.agentName}: ${data.message}`);
});

socket.on('ticket_status_update', (data) => {
  console.log(`🔄 Status: ${data.status}`);
  if (data.status === 'Resolved' || data.status === 'Escalated') {
    console.log('✅ Test complete!');
    process.exit(0);
  }
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});

// 20 second timeout
setTimeout(() => {
  console.log('❌ Timeout reached');
  process.exit(1);
}, 20000);