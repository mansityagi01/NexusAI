// Simple test script to verify functionality
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('✅ Connected to server successfully');
  
  // Test creating a ticket
  socket.emit('create_ticket', { 
    ticket_subject: 'Test phishing email detected - urgent security concern' 
  });
  
  console.log('📧 Test ticket created');
});

socket.on('ticket_created', (data) => {
  console.log('🎫 Ticket created:', data);
});

socket.on('log_update', (data) => {
  console.log(`📝 Log [${data.agentName}]: ${data.message}`);
});

socket.on('ticket_status_update', (data) => {
  console.log(`🔄 Ticket ${data.ticketId} status: ${data.status}`);
  
  // Disconnect after ticket is resolved or escalated
  if (data.status === 'Resolved' || data.status === 'Escalated') {
    console.log('✅ Test completed successfully!');
    socket.disconnect();
    process.exit(0);
  }
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏰ Test timeout - closing connection');
  socket.disconnect();
  process.exit(1);
}, 30000);