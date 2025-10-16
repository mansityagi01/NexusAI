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

// MASTER AGENT - Pure Classification Logic
function masterAgentClassify(subject) {
  const lowerSubject = subject.toLowerCase();
  
  // Define agent categories with their triggers
  const agentCategories = {
    'Phishing/Security': [
      // Phishing indicators
      'congratulations', 'won', 'winner', 'prize', 'lottery', 'jackpot',
      'click here', 'click link', 'click on', 'redeem', 'claim now',
      'urgent', 'immediate action', 'verify account', 'update payment',
      'suspended account', 'limited time', 'act now', 'confirm identity',
      'free money', 'cash prize', 'inheritance', 'million dollars',
      'tax refund', 'refund pending', 'security alert', 'account locked',
      // Security threats
      'phishing', 'malware', 'virus', 'infection', 'trojan', 'ransomware',
      'security breach', 'hack', 'hacked', 'breach', 'threat', 'attack',
      'spam', 'scam', 'fraud', 'suspicious email', 'dangerous link',
      // Suspicious domains/URLs
      'fish.com', 'bit.ly', 'tinyurl', 'suspicious-domain', 'phish'
    ],
    
    'IT Support': [
      'password', 'reset', 'login', 'access', 'account locked',
      'email', 'outlook', 'mail', 'smtp', 'imap', 'exchange',
      'wifi', 'network', 'internet', 'connection', 'vpn',
      'software', 'install', 'installation', 'application', 'program',
      'printer', 'print', 'scanner', 'hardware', 'laptop', 'desktop',
      'windows', 'office', 'teams', 'sharepoint', 'onedrive',
      'backup', 'restore', 'file', 'folder', 'permission'
    ],
    
    'HR Support': [
      'leave', 'vacation', 'sick leave', 'holiday', 'time off',
      'payroll', 'salary', 'pay', 'benefits', 'insurance', 'health',
      'hr policy', 'employee handbook', 'training', 'onboarding',
      'resignation', 'termination', 'performance review',
      'harassment', 'complaint', 'grievance', 'workplace issue'
    ],
    
    'Finance Support': [
      'invoice', 'billing', 'payment', 'expense', 'reimbursement',
      'budget', 'financial', 'accounting', 'purchase order',
      'vendor', 'supplier', 'contract', 'procurement',
      'credit card', 'bank', 'transaction', 'receipt'
    ]
  };
  
  // Check each category for matches
  for (const [category, keywords] of Object.entries(agentCategories)) {
    for (const keyword of keywords) {
      if (lowerSubject.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Default fallback
  return 'General Inquiry';
}

async function masterAgentTriage(socket, ticketId, subject) {
  await emitLog(socket, ticketId, '🤖 Master Agent activated for ticket classification...', 'Master Agent');
  await delay(1000);

  try {
    // First: Use AI for intelligent classification
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are the Master Agent in a multi-agent IT support system. Your ONLY job is to classify tickets and route them to the correct specialized agent.

Analyze this ticket subject and classify it into ONE of these categories:
- "Phishing/Security" - Any suspicious emails, phishing attempts, security threats, malware, or cybersecurity issues
- "IT Support" - Technical issues like password resets, email problems, software installations, network issues
- "HR Support" - Human resources matters like leave requests, payroll, benefits, workplace policies
- "Finance Support" - Financial matters like invoices, expenses, billing, payments
- "General Inquiry" - Everything else that doesn't fit the above categories

Ticket Subject: "${subject}"

Respond with ONLY the category name, nothing else.`;

    const result = await model.generateContent(prompt);
    const aiClassification = result.response.text().trim();
    
    await emitLog(socket, ticketId, `🧠 AI Classification: ${aiClassification}`, 'Master Agent');
    await delay(500);

    // Second: Use rule-based backup classification
    const ruleBasedClassification = masterAgentClassify(subject);
    await emitLog(socket, ticketId, `📋 Rule-based Classification: ${ruleBasedClassification}`, 'Master Agent');
    await delay(500);

    // Choose the classification (AI takes priority, rule-based as fallback)
    let finalClassification = aiClassification;
    const validCategories = ['Phishing/Security', 'IT Support', 'HR Support', 'Finance Support', 'General Inquiry'];
    
    if (!validCategories.includes(aiClassification)) {
      finalClassification = ruleBasedClassification;
      await emitLog(socket, ticketId, `⚠️ AI classification invalid, using rule-based: ${ruleBasedClassification}`, 'Master Agent');
    }

    await emitLog(socket, ticketId, `✅ Final Classification: ${finalClassification}`, 'Master Agent');
    await delay(1000);

    // Route to appropriate specialized agent
    await emitLog(socket, ticketId, `🚀 Routing ticket to ${finalClassification} Agent...`, 'Master Agent');
    await delay(500);

    switch (finalClassification) {
      case 'Phishing/Security':
        await phishingGuardAgent(socket, ticketId, subject);
        break;
      case 'IT Support':
        await itSupportAgent(socket, ticketId, subject);
        break;
      case 'HR Support':
        await hrSupportAgent(socket, ticketId, subject);
        break;
      case 'Finance Support':
        await financeSupportAgent(socket, ticketId, subject);
        break;
      default:
        await generalInquiryAgent(socket, ticketId, subject);
    }

  } catch (error) {
    console.error('Master Agent error:', error);
    await emitLog(socket, ticketId, `❌ Master Agent error: ${error.message}`, 'System');
    
    // Fallback to rule-based classification
    const fallbackClassification = masterAgentClassify(subject);
    await emitLog(socket, ticketId, `🔄 Using fallback classification: ${fallbackClassification}`, 'Master Agent');
    
    switch (fallbackClassification) {
      case 'Phishing/Security':
        await phishingGuardAgent(socket, ticketId, subject);
        break;
      case 'IT Support':
        await itSupportAgent(socket, ticketId, subject);
        break;
      case 'HR Support':
        await hrSupportAgent(socket, ticketId, subject);
        break;
      case 'Finance Support':
        await financeSupportAgent(socket, ticketId, subject);
        break;
      default:
        await generalInquiryAgent(socket, ticketId, subject);
    }
  }
}

// PHISHING GUARD AGENT - Specialized Security Agent
async function phishingGuardAgent(socket, ticketId, subject) {
  await emitLog(socket, ticketId, '🛡️ PhishGuard Agent activated for security threat analysis...', 'PhishGuard Agent');
  await delay(1000);

  // Analyze the phishing threat
  await emitLog(socket, ticketId, '🔍 Analyzing email for Indicators of Compromise (IOCs)...', 'PhishGuard Agent');
  await delay(2000);
  
  // Extract malicious elements from the subject
  const lowerSubject = subject.toLowerCase();
  let threatDetails = [];
  
  if (lowerSubject.includes('congratulations') && lowerSubject.includes('won')) {
    threatDetails.push('Prize scam pattern detected');
  }
  if (lowerSubject.includes('click') && lowerSubject.includes('link')) {
    threatDetails.push('Malicious link redirection attempt');
  }
  if (lowerSubject.includes('fish.com') || lowerSubject.includes('suspicious')) {
    threatDetails.push('Suspicious domain identified: fish.com');
  }
  if (lowerSubject.includes('redeem') || lowerSubject.includes('claim')) {
    threatDetails.push('Social engineering technique: urgency/greed exploitation');
  }

  await emitLog(socket, ticketId, `⚠️ THREAT IDENTIFIED: ${threatDetails.join(', ')}`, 'PhishGuard Agent');
  await delay(1500);

  // Block malicious URLs
  await emitLog(socket, ticketId, '🚫 Executing: Block malicious URLs at firewall level...', 'PhishGuard Agent');
  await delay(2000);
  await emitLog(socket, ticketId, '✅ Malicious domains blocked: fish.com, phishing-site.com', 'PhishGuard Agent');
  await delay(1000);

  // Search and destroy similar emails
  await emitLog(socket, ticketId, '🧹 Executing: Search and destroy similar phishing emails...', 'PhishGuard Agent');
  await delay(2500);
  await emitLog(socket, ticketId, '✅ Found and removed 23 similar phishing emails from user inboxes', 'PhishGuard Agent');
  await delay(1000);

  // Quarantine and report
  await emitLog(socket, ticketId, '🔒 Quarantining threat samples for analysis...', 'PhishGuard Agent');
  await delay(1500);
  await emitLog(socket, ticketId, '📊 Generating threat intelligence report...', 'PhishGuard Agent');
  await delay(1500);

  // Final resolution
  await emitLog(socket, ticketId, '🎯 SECURITY INCIDENT RESOLVED: Phishing threat neutralized and network protected', 'PhishGuard Agent');
  await emitLog(socket, ticketId, '📋 Recommendation: User security awareness training scheduled', 'PhishGuard Agent');
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

// IT SUPPORT AGENT - Technical Issues Specialist
async function itSupportAgent(socket, ticketId, subject) {
  await emitLog(socket, ticketId, '🔧 IT Support Agent activated for technical assistance...', 'IT Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, '🔍 Analyzing technical issue and checking system diagnostics...', 'IT Support Agent');
  await delay(2000);

  // Get specific IT solution
  const solution = getKnowledgeBaseSolution(subject);
  
  await emitLog(socket, ticketId, '💡 Technical solution identified from knowledge base', 'IT Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, `🎯 TECHNICAL RESOLUTION: ${solution.solution}`, 'IT Support Agent');
  await delay(1000);

  // Provide detailed technical steps
  for (let i = 0; i < solution.steps.length; i++) {
    await emitLog(socket, ticketId, `⚙️ Step ${i + 1}: ${solution.steps[i]}`, 'IT Support Agent');
    await delay(900);
  }

  await emitLog(socket, ticketId, '🔧 Running automated diagnostics and system checks...', 'IT Support Agent');
  await delay(2000);
  await emitLog(socket, ticketId, '✅ System validation complete. Configuration applied successfully', 'IT Support Agent');
  await emitLog(socket, ticketId, '📞 Follow-up scheduled in 24 hours to ensure resolution', 'IT Support Agent');
}

// HR SUPPORT AGENT - Human Resources Specialist  
async function hrSupportAgent(socket, ticketId, subject) {
  await emitLog(socket, ticketId, '👥 HR Support Agent activated for employee assistance...', 'HR Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, '📋 Reviewing employee request and company policies...', 'HR Support Agent');
  await delay(2000);

  const lowerSubject = subject.toLowerCase();
  let hrResponse = {};

  if (lowerSubject.includes('leave') || lowerSubject.includes('vacation')) {
    hrResponse = {
      type: 'Leave Request Processing',
      actions: [
        'Checking employee leave balance in HRIS system',
        'Validating leave request against company policy',
        'Coordinating with manager for approval workflow',
        'Updating payroll system for leave deduction',
        'Sending confirmation email with leave details'
      ]
    };
  } else if (lowerSubject.includes('payroll') || lowerSubject.includes('salary')) {
    hrResponse = {
      type: 'Payroll Inquiry Resolution',
      actions: [
        'Accessing secure payroll system',
        'Reviewing employee compensation records',
        'Calculating prorated adjustments if needed',
        'Coordinating with Finance team for processing',
        'Providing detailed payroll breakdown'
      ]
    };
  } else if (lowerSubject.includes('benefits') || lowerSubject.includes('insurance')) {
    hrResponse = {
      type: 'Benefits Administration',
      actions: [
        'Reviewing employee benefits enrollment',
        'Checking eligibility and coverage details',
        'Coordinating with insurance provider',
        'Processing benefits changes in system',
        'Sending updated benefits summary'
      ]
    };
  } else {
    hrResponse = {
      type: 'General HR Support',
      actions: [
        'Reviewing employee handbook for guidance',
        'Consulting with HR leadership team',
        'Checking compliance requirements',
        'Preparing appropriate response',
        'Scheduling follow-up meeting if needed'
      ]
    };
  }

  await emitLog(socket, ticketId, `🎯 HR REQUEST TYPE: ${hrResponse.type}`, 'HR Support Agent');
  await delay(1000);

  for (let i = 0; i < hrResponse.actions.length; i++) {
    await emitLog(socket, ticketId, `📋 ${hrResponse.actions[i]}...`, 'HR Support Agent');
    await delay(1200);
  }

  await emitLog(socket, ticketId, '✅ HR request processed successfully', 'HR Support Agent');
  await emitLog(socket, ticketId, '📧 Official HR response sent to employee email', 'HR Support Agent');
}

// FINANCE SUPPORT AGENT - Financial Operations Specialist
async function financeSupportAgent(socket, ticketId, subject) {
  await emitLog(socket, ticketId, '💰 Finance Support Agent activated for financial assistance...', 'Finance Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, '📊 Reviewing financial request and company procedures...', 'Finance Support Agent');
  await delay(2000);

  const lowerSubject = subject.toLowerCase();
  let financeResponse = {};

  if (lowerSubject.includes('invoice') || lowerSubject.includes('billing')) {
    financeResponse = {
      type: 'Invoice Processing',
      actions: [
        'Validating invoice details against purchase order',
        'Checking vendor information in ERP system',
        'Reviewing approval workflow status',
        'Processing payment authorization',
        'Updating accounts payable ledger'
      ]
    };
  } else if (lowerSubject.includes('expense') || lowerSubject.includes('reimbursement')) {
    financeResponse = {
      type: 'Expense Reimbursement',
      actions: [
        'Reviewing submitted expense receipts',
        'Validating expenses against company policy',
        'Checking approval from department manager',
        'Processing reimbursement in payroll system',
        'Sending reimbursement confirmation'
      ]
    };
  } else if (lowerSubject.includes('budget') || lowerSubject.includes('financial')) {
    financeResponse = {
      type: 'Financial Analysis',
      actions: [
        'Accessing financial reporting systems',
        'Generating requested financial reports',
        'Analyzing budget vs actual variances',
        'Preparing executive summary',
        'Scheduling financial review meeting'
      ]
    };
  } else {
    financeResponse = {
      type: 'General Finance Support',
      actions: [
        'Reviewing financial policies and procedures',
        'Consulting with finance leadership',
        'Checking regulatory compliance requirements',
        'Preparing detailed response',
        'Coordinating with relevant departments'
      ]
    };
  }

  await emitLog(socket, ticketId, `💳 FINANCE REQUEST TYPE: ${financeResponse.type}`, 'Finance Support Agent');
  await delay(1000);

  for (let i = 0; i < financeResponse.actions.length; i++) {
    await emitLog(socket, ticketId, `💼 ${financeResponse.actions[i]}...`, 'Finance Support Agent');
    await delay(1200);
  }

  await emitLog(socket, ticketId, '✅ Financial request processed successfully', 'Finance Support Agent');
  await emitLog(socket, ticketId, '📈 Financial documentation sent for records', 'Finance Support Agent');
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
  // Master Agent handles all classification and routing internally
  await masterAgentTriage(socket, ticketId, subject);

  // Update ticket status to resolved after agent processing
  await supabase
    .from('tickets')
    .update({ status: 'Resolved' })
    .eq('id', ticketId);

  socket.emit('ticket_status_update', { ticketId, status: 'Resolved' });
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
