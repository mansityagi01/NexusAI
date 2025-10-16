import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? true  // Allow same origin requests
      : '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow same origin requests
    : '*',
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  // Serve static files from dist directory
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'NexusAI Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: ['Socket.IO', 'Supabase', 'Gemini AI', 'Multi-Agent System']
  });
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://tgfwlcooihvfwhbekimi.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY'
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || 'AIzaSyB0rBIFmdOIDKJAxdxQ_eG49s3A6oUW2wQ');

function generateTicketId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SIM-${randomNum}`;
}

async function emitLog(socket, ticketId, message, agentName) {
  socket.emit('log_update', { ticketId, message, agentName });

  await supabase.from('logs').insert({
    ticket_id: ticketId,
    message,
    agent_name: agentName
  });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple rule-based classification as backup
function simpleClassification(subject) {
  const lowerSubject = subject.toLowerCase();
  const securityKeywords = [
    'phishing', 'suspicious', 'malicious', 'virus', 'malware', 
    'security', 'hack', 'breach', 'threat', 'spam', 'scam',
    'fraud', 'suspicious email', 'dangerous', 'attack'
  ];
  
  for (const keyword of securityKeywords) {
    if (lowerSubject.includes(keyword)) {
      return 'Phishing/Security';
    }
  }
  
  return 'General Inquiry';
}

async function masterAgentTriage(socket, ticketId, subject) {
  await emitLog(socket, ticketId, 'Delegating to Master Agent for triage...', 'System');
  await delay(1500);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a Master Agent in an IT operations system. Classify the following ticket subject into one of these categories: 'Phishing/Security' or 'General Inquiry'.

Ticket Subject: "${subject}"

Respond with ONLY one of these two categories: "Phishing/Security" or "General Inquiry"`;

    const result = await model.generateContent(prompt);
    const classification = result.response.text().trim();

    await emitLog(socket, ticketId, `Master Agent classified ticket as: '${classification}'`, 'Master Agent');
    await delay(1000);

    return classification.includes('Phishing') || classification.includes('Security') ? 'Phishing/Security' : 'General Inquiry';
  } catch (error) {
    console.error('Error calling Gemini API, using rule-based classification:', error.message);
    
    // Use simple rule-based classification as backup
    const classification = simpleClassification(subject);
    await emitLog(socket, ticketId, `Master Agent classified ticket as: '${classification}' (rule-based)`, 'Master Agent');
    await delay(1000);
    return classification;
  }
}

async function phishGuardAgent(socket, ticketId) {
  await emitLog(socket, ticketId, 'Delegating to PhishGuard Agent for threat remediation...', 'Master Agent');
  await delay(1000);

  await emitLog(socket, ticketId, 'Executing tool: analyze_email_for_iocs to find Indicators of Compromise...', 'PhishGuard Agent');
  await delay(2500);
  await emitLog(socket, ticketId, 'Tool complete. Found malicious URL: https://evil-phishing-site.com', 'PhishGuard Agent');
  await delay(1000);

  await emitLog(socket, ticketId, 'Executing tool: block_malicious_url...', 'PhishGuard Agent');
  await delay(2000);
  await emitLog(socket, ticketId, 'Tool complete. Malicious URL has been blocked at the firewall.', 'PhishGuard Agent');
  await delay(1000);

  await emitLog(socket, ticketId, 'Executing tool: search_and_destroy_email to eradicate threat...', 'PhishGuard Agent');
  await delay(2500);
  await emitLog(socket, ticketId, 'Tool complete. Removed threat from 15 user inboxes.', 'PhishGuard Agent');
  await delay(1000);

  await emitLog(socket, ticketId, 'Threat neutralized. Ticket resolved.', 'PhishGuard Agent');
}

// Knowledge base for common IT issues
function getKnowledgeBaseSolution(subject) {
  const lowerSubject = subject.toLowerCase();
  
  if (lowerSubject.includes('email') || lowerSubject.includes('outlook') || lowerSubject.includes('mail')) {
    return {
      solution: 'Email Client Setup Instructions',
      steps: [
        '1. Open your email client (Outlook/Thunderbird)',
        '2. Go to File → Add Account',
        '3. Enter your company email address',
        '4. Use server settings: IMAP - mail.company.com, Port 993 (SSL)',
        '5. SMTP - smtp.company.com, Port 587 (TLS)',
        '6. Contact IT if authentication issues persist'
      ]
    };
  }
  
  if (lowerSubject.includes('password') || lowerSubject.includes('reset') || lowerSubject.includes('login')) {
    return {
      solution: 'Password Reset Procedure',
      steps: [
        '1. Go to company self-service portal: portal.company.com',
        '2. Click "Forgot Password"',
        '3. Enter your username or email address',
        '4. Check your recovery email for reset link',
        '5. Follow the link and create new password',
        '6. Password must be 8+ characters with numbers and symbols'
      ]
    };
  }
  
  if (lowerSubject.includes('wifi') || lowerSubject.includes('network') || lowerSubject.includes('internet')) {
    return {
      solution: 'WiFi Connection Setup',
      steps: [
        '1. Connect to network: CompanyWiFi',
        '2. Use your domain credentials (DOMAIN\\username)',
        '3. If prompted, accept security certificate',
        '4. For guest access, use network: CompanyGuest (no password)',
        '5. Contact IT for VPN setup if working remotely'
      ]
    };
  }
  
  if (lowerSubject.includes('software') || lowerSubject.includes('install') || lowerSubject.includes('application')) {
    return {
      solution: 'Software Installation Guide',
      steps: [
        '1. Check if software is available in Software Center',
        '2. Search for the application name',
        '3. Click Install (admin rights required)',
        '4. For non-standard software, submit request form',
        '5. Include business justification and license info'
      ]
    };
  }
  
  if (lowerSubject.includes('printer') || lowerSubject.includes('print')) {
    return {
      solution: 'Printer Setup Instructions',
      steps: [
        '1. Go to Settings → Printers & Scanners',
        '2. Click "Add Printer"',
        '3. Select network printer from list',
        '4. Common printers: \\\\printserver\\Floor2-HP, \\\\printserver\\Floor3-Canon',
        '5. Install driver if prompted',
        '6. Test print to verify setup'
      ]
    };
  }
  
  return {
    solution: 'General IT Support Response',
    steps: [
      '1. Your request has been logged and prioritized',
      '2. A support technician will contact you within 24 hours',
      '3. Please have your employee ID and asset tag ready',
      '4. For urgent issues, call the IT helpdesk: ext. 4357',
      '5. Check our knowledge base: help.company.com'
    ]
  };
}

async function generalInquiryAgent(socket, ticketId, subject) {
  await emitLog(socket, ticketId, 'Delegating to General Support Agent...', 'Master Agent');
  await delay(1000);

  await emitLog(socket, ticketId, 'Analyzing user inquiry and checking knowledge base...', 'General Support Agent');
  await delay(2000);
  
  await emitLog(socket, ticketId, 'Found relevant documentation and preparing response...', 'General Support Agent');
  await delay(1500);
  
  // Get specific solution from knowledge base
  const solution = getKnowledgeBaseSolution(subject);
  
  await emitLog(socket, ticketId, `✅ SOLUTION: ${solution.solution}`, 'General Support Agent');
  await delay(1000);
  
  // Provide step-by-step instructions
  for (let i = 0; i < solution.steps.length; i++) {
    await emitLog(socket, ticketId, `📋 ${solution.steps[i]}`, 'General Support Agent');
    await delay(800);
  }
  
  await emitLog(socket, ticketId, '📧 Detailed instructions sent to user email. Ticket escalated for follow-up if needed.', 'General Support Agent');
  await delay(1000);
}

async function processTicket(socket, ticketId, subject) {
  const classification = await masterAgentTriage(socket, ticketId, subject);

  if (classification === 'Phishing/Security') {
    await phishGuardAgent(socket, ticketId);

    await supabase
      .from('tickets')
      .update({ status: 'Resolved' })
      .eq('id', ticketId);

    socket.emit('ticket_status_update', { ticketId, status: 'Resolved' });
  } else {
    await generalInquiryAgent(socket, ticketId, subject);

    await supabase
      .from('tickets')
      .update({ status: 'Escalated' })
      .eq('id', ticketId);

    socket.emit('ticket_status_update', { ticketId, status: 'Escalated' });
  }
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create_ticket', async (data) => {
    const { ticket_subject } = data;
    const ticketId = generateTicketId();

    console.log(`Creating ticket ${ticketId}: ${ticket_subject}`);

    const { error } = await supabase.from('tickets').insert({
      id: ticketId,
      subject: ticket_subject,
      status: 'Processing'
    });

    if (error) {
      console.error('Error creating ticket:', error);
      socket.emit('error', { message: 'Failed to create ticket' });
      return;
    }

    socket.emit('ticket_created', { ticketId, subject: ticket_subject, status: 'Processing' });

    processTicket(socket, ticketId, ticket_subject);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
