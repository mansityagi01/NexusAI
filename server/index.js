import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ollama } from 'ollama';
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

// Health check endpoint with AI service status
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      ollama: { status: 'unknown', message: '', url: 'http://localhost:11434' },
      gemini: { status: 'unknown', message: '', configured: !!process.env.GEMINI_API_KEY },
      supabase: { status: 'unknown', message: '', configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) }
    }
  };

  // Check Ollama service
  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/version', { 
      timeout: 3000,
      signal: AbortSignal.timeout(3000)
    });
    if (ollamaResponse.ok) {
      const version = await ollamaResponse.json();
      healthStatus.services.ollama = { 
        status: 'available', 
        message: `Ollama v${version.version || 'unknown'} running`,
        url: 'http://localhost:11434'
      };
    } else {
      healthStatus.services.ollama.status = 'error';
      healthStatus.services.ollama.message = `HTTP ${ollamaResponse.status}`;
    }
  } catch (error) {
    healthStatus.services.ollama = {
      status: 'unavailable',
      message: 'Service not running. Install: https://ollama.ai/download',
      url: 'http://localhost:11434',
      error: error.message
    };
  }

  // Check Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      healthStatus.services.gemini = {
        status: 'configured',
        message: 'API key configured and ready',
        configured: true
      };
    } catch (error) {
      healthStatus.services.gemini = {
        status: 'error',
        message: `Configuration error: ${error.message}`,
        configured: true
      };
    }
  } else {
    healthStatus.services.gemini = {
      status: 'not_configured',
      message: 'GEMINI_API_KEY not provided (fallback AI)',
      configured: false
    };
  }

  // Check Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    healthStatus.services.supabase = {
      status: 'configured',
      message: 'Database connection configured',
      configured: true
    };
  } else {
    healthStatus.services.supabase = {
      status: 'not_configured',
      message: 'SUPABASE_URL or SUPABASE_ANON_KEY missing',
      configured: false
    };
  }

  res.json(healthStatus);
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

// Test route
app.get('/test', (req, res) => {
  res.send('<h1>🚀 NexusAI Server is Working!</h1><p>Environment: ' + (process.env.NODE_ENV || 'development') + '</p>');
});

// Serve static files from the React app build directory
const staticPath = path.join(__dirname, '../dist');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://tgfwlcooihvfwhbekimi.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY'
);

// Initialize AI services
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || 'AIzaSyB0rBIFmdOIDKJAxdxQ_eG49s3A6oUW2wQ');
const ollama = new Ollama({ host: 'http://localhost:11434' });

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

// ENHANCED MASTER AGENT - Advanced Classification Logic
function masterAgentClassify(fullContent) {
  const lowerContent = fullContent.toLowerCase();
  
  // Define comprehensive agent categories with enhanced keyword detection
  const agentCategories = {
    'Phishing/Security': [
      // Classic phishing indicators
      'congratulations', 'congratulation', 'congrats', 'won', 'winner', 'prize', 'lottery', 'jackpot',
      'click here', 'click link', 'click on', 'click the link', 'redeem', 'claim now', 'claim your',
      'urgent', 'immediate action', 'act now', 'limited time', 'expires soon', 'deadline',
      'verify account', 'update payment', 'confirm identity', 'suspended account', 'account locked',
      'free money', 'cash prize', 'inheritance', 'million dollars', 'tax refund', 'refund pending',
      
      // Security threats and suspicious activity
      'phishing', 'malware', 'virus', 'infection', 'trojan', 'ransomware', 'spyware',
      'security breach', 'hack', 'hacked', 'breach', 'threat', 'attack', 'cyber',
      'spam', 'scam', 'fraud', 'fraudulent', 'suspicious email', 'dangerous link',
      'unauthorized access', 'data breach', 'identity theft',
      'suspicious mail', 'suspicious message', 'suspicious email', 'strange email',
      'laptop not in control', 'computer not in control', 'device compromised', 'system compromised',
      'lost control', 'cannot control', 'acting strange', 'behaving oddly',
      'remote access', 'someone controlling', 'unauthorized control', 'hijacked',
      'infected computer', 'compromised device', 'malicious software',
      
      // Suspicious domains and patterns
      'fish.com', 'bit.ly', 'tinyurl', 'suspicious-domain', 'phish', 'fake-bank',
      'amazon security', 'paypal alert', 'bank notice', 'credit card', 'social security',
      
      // Nigerian prince and advance fee scams
      'nigerian prince', 'inheritance fund', 'beneficiary', 'transfer money',
      'deceased person', 'will and testament', 'lawyer contact', 'bank transfer',
      
      // Tech support scams
      'microsoft support', 'windows expired', 'computer infected', 'call immediately',
      'tech support', 'refund available', 'subscription renewal'
    ],
    
    'IT Support': [
      // Password and access issues (high priority keywords)
      'password reset', 'reset password', 'forgot password', 'change password', 
      'password', 'reset', 'login', 'access', 'account locked', 'cannot login',
      'password expired', 'two factor', 'need to reset', 'help resetting',
      
      // Email issues
      'email', 'outlook', 'mail', 'smtp', 'imap', 'exchange', 'inbox',
      'cannot send', 'cannot receive', 'email setup', 'mail client',
      
      // Network and connectivity
      'wifi', 'network', 'internet', 'connection', 'vpn', 'remote access',
      'cannot connect', 'slow internet', 'network drive', 'shared folder',
      
      // Software and applications
      'software', 'install', 'installation', 'application', 'program', 'app',
      'office', 'teams', 'sharepoint', 'onedrive', 'adobe', 'chrome',
      'update', 'upgrade', 'license', 'activation',
      
      // Hardware issues
      'printer', 'print', 'scanner', 'hardware', 'laptop', 'desktop',
      'monitor', 'keyboard', 'mouse', 'webcam', 'microphone',
      'not working', 'broken', 'repair', 'replacement',
      
      // System issues
      'windows', 'operating system', 'blue screen', 'crash', 'freeze',
      'slow computer', 'performance', 'backup', 'restore', 'file recovery'
    ],
    
    'HR Support': [
      // Leave and time off
      'leave', 'vacation', 'sick leave', 'holiday', 'time off', 'pto',
      'annual leave', 'maternity leave', 'paternity leave', 'bereavement',
      'personal day', 'mental health day',
      
      // Payroll and compensation
      'payroll', 'salary', 'pay', 'paycheck', 'wage', 'overtime',
      'bonus', 'commission', 'raise', 'promotion', 'pay stub',
      
      // Benefits and insurance
      'benefits', 'insurance', 'health', 'dental', 'vision', 'medical',
      'retirement', '401k', 'pension', 'life insurance', 'disability',
      
      // HR policies and procedures
      'hr policy', 'employee handbook', 'code of conduct', 'dress code',
      'training', 'onboarding', 'orientation', 'performance review',
      'disciplinary action', 'termination', 'resignation',
      
      // Workplace issues
      'harassment', 'discrimination', 'complaint', 'grievance', 'workplace issue',
      'hostile environment', 'bullying', 'conflict resolution',
      'accommodation', 'disability', 'religious accommodation'
    ],
    
    'Finance Support': [
      // Invoicing and billing
      'invoice', 'billing', 'bill', 'payment', 'pay', 'charge',
      'invoice approval', 'payment processing', 'overdue', 'outstanding',
      
      // Expenses and reimbursement
      'expense', 'reimbursement', 'travel expense', 'mileage', 'receipt',
      'expense report', 'petty cash', 'advance', 'per diem',
      
      // Budget and financial planning
      'budget', 'financial', 'accounting', 'cost center', 'allocation',
      'forecast', 'variance', 'financial report', 'p&l', 'balance sheet',
      
      // Vendor and procurement
      'vendor', 'supplier', 'contract', 'procurement', 'purchase order',
      'requisition', 'approval', 'vendor setup', 'payment terms',
      
      // Banking and transactions
      'bank', 'transaction', 'wire transfer', 'ach', 'check', 'deposit',
      'credit card', 'corporate card', 'reconciliation', 'statement'
    ]
  };
  
  // Enhanced scoring system for better accuracy
  let categoryScores = {};
  
  for (const [category, keywords] of Object.entries(agentCategories)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword)) {
        // Give higher scores for exact matches and longer keywords
        let baseScore = keyword.length > 10 ? 3 : keyword.length > 5 ? 2 : 1;
        
        // Special high-priority scoring for common patterns
        if (category === 'IT Support') {
          if (keyword.includes('password') || keyword.includes('reset') || keyword.includes('login')) {
            baseScore += 2; // Extra points for password/login issues
          }
        }
        
        score += baseScore;
      }
    }
    categoryScores[category] = score;
  }
  
  // Find the category with the highest score
  const maxScore = Math.max(...Object.values(categoryScores));
  if (maxScore > 0) {
    for (const [category, score] of Object.entries(categoryScores)) {
      if (score === maxScore) {
        return category;
      }
    }
  }
  
  // Default fallback
  return 'General Inquiry';
}

async function masterAgentTriage(socket, ticketId, fullContent) {
  await emitLog(socket, ticketId, '🤖 Master Agent activated for advanced ticket classification...', 'Master Agent');
  await delay(1000);

  try {
    // STEP 1: Enhanced Rule-based Classification (Primary)
    const ruleBasedClassification = masterAgentClassify(fullContent);
    await emitLog(socket, ticketId, `📋 Enhanced Rule-based Analysis: ${ruleBasedClassification}`, 'Master Agent');
    await delay(500);

    let finalClassification = ruleBasedClassification;
    let aiUsed = 'Enhanced Rule-based System';

  // STEP 2: Try Ollama (Local AI) for verification
  try {
    await emitLog(socket, ticketId, '🦙 Attempting Ollama AI verification...', 'Master Agent');
    
    // Check if Ollama service is available first
    const healthResponse = await fetch('http://localhost:11434/api/version');
    if (!healthResponse.ok) {
      throw new Error('Ollama service not running');
    }
    
    const ollamaPrompt = `You are an expert IT support classifier. Classify this ticket into ONE category.

CATEGORIES:
- "IT Support": Password resets, email issues, software problems, network connectivity, hardware troubleshooting
- "Phishing/Security": Suspicious emails, malicious links, security threats, phishing attempts, malware alerts, compromised devices, laptop control issues
- "HR Support": Leave requests, payroll questions, benefits, workplace issues, employee policies
- "Finance Support": Invoices, expenses, billing, payments, budget questions, vendor issues
- "General Inquiry": Questions that don't fit above categories

EXAMPLES:
"I need to reset my password" → IT Support
"Forgot my login credentials" → IT Support
"Can't connect to WiFi" → IT Support
"Suspicious email from fake bank" → Phishing/Security
"I got a suspicious mail and it caused my laptop not in my control" → Phishing/Security
"Need vacation days approved" → HR Support
"Invoice payment question" → Finance Support

TICKET: "${fullContent}"

ANSWER: Only respond with the exact category name.`;

    const ollamaResponse = await ollama.generate({
      model: 'llama2',
      prompt: ollamaPrompt,
      stream: false
    });

    if (ollamaResponse && ollamaResponse.response) {
      const ollamaClassification = ollamaResponse.response.trim();
      const validCategories = ['Phishing/Security', 'IT Support', 'HR Support', 'Finance Support', 'General Inquiry'];
      
      // More strict validation - look for exact matches or close matches
      let matchedCategory = null;
      for (const cat of validCategories) {
        if (ollamaClassification === cat || 
            ollamaClassification.toLowerCase().includes(cat.toLowerCase()) ||
            cat.toLowerCase().includes(ollamaClassification.toLowerCase())) {
          matchedCategory = cat;
          break;
        }
      }
      
      if (matchedCategory) {
        finalClassification = matchedCategory;
        aiUsed = 'Ollama (Local AI)';
      } else {
        await emitLog(socket, ticketId, `⚠️ Ollama gave unclear response: "${ollamaClassification}". Using rule-based classification.`, 'Master Agent');
      }
      
      await emitLog(socket, ticketId, `🦙 Ollama AI Classification: ${ollamaClassification}`, 'Master Agent');
      await delay(500);
    }
  } catch (ollamaError) {
    await emitLog(socket, ticketId, `⚠️ Ollama unavailable (${ollamaError.message}), trying Gemini fallback...`, 'Master Agent');
    
    // STEP 3: Try Gemini (Cloud AI) as final fallback
      try {
        await emitLog(socket, ticketId, '🧠 Attempting Gemini AI fallback...', 'Master Agent');
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const geminiPrompt = `You are the Master Agent in a multi-agent IT support system. Classify this ticket into ONE category:

Categories:
- "Phishing/Security" - Suspicious emails, phishing attempts, security threats, malware, compromised devices, laptop control issues
- "IT Support" - Technical issues like passwords, email, software, hardware
- "HR Support" - Human resources matters like leave, payroll, benefits
- "Finance Support" - Financial matters like invoices, expenses, billing
- "General Inquiry" - Everything else

Ticket Content: "${fullContent}"

Respond with ONLY the category name.`;

        const result = await model.generateContent(geminiPrompt);
        const geminiClassification = result.response.text().trim();
        
        const validCategories = ['Phishing/Security', 'IT Support', 'HR Support', 'Finance Support', 'General Inquiry'];
        if (validCategories.includes(geminiClassification)) {
          finalClassification = geminiClassification;
          aiUsed = 'Google Gemini Pro';
        }
        
        await emitLog(socket, ticketId, `🧠 Gemini AI Classification: ${geminiClassification}`, 'Master Agent');
        await delay(500);
      } catch (geminiError) {
        await emitLog(socket, ticketId, `⚠️ All AI services unavailable, using enhanced rule-based system`, 'Master Agent');
      }
    }

    await emitLog(socket, ticketId, `✅ Final Classification: ${finalClassification} (via ${aiUsed})`, 'Master Agent');
    await delay(1000);

    // Route to appropriate specialized agent
    await emitLog(socket, ticketId, `🚀 Routing ticket to ${finalClassification} Agent...`, 'Master Agent');
    await delay(500);

    switch (finalClassification) {
      case 'Phishing/Security':
        await phishingGuardAgent(socket, ticketId, fullContent);
        break;
      case 'IT Support':
        await itSupportAgent(socket, ticketId, fullContent);
        break;
      case 'HR Support':
        await hrSupportAgent(socket, ticketId, fullContent);
        break;
      case 'Finance Support':
        await financeSupportAgent(socket, ticketId, fullContent);
        break;
      default:
        await generalInquiryAgent(socket, ticketId, fullContent);
    }

  } catch (error) {
    console.error('Master Agent error:', error);
    await emitLog(socket, ticketId, `❌ Master Agent error: ${error.message}`, 'System');
    
    // Ultimate fallback to enhanced rule-based classification
    const fallbackClassification = masterAgentClassify(fullContent);
    await emitLog(socket, ticketId, `🔄 Using enhanced rule-based fallback: ${fallbackClassification}`, 'Master Agent');
    
    switch (fallbackClassification) {
      case 'Phishing/Security':
        await phishingGuardAgent(socket, ticketId, fullContent);
        break;
      case 'IT Support':
        await itSupportAgent(socket, ticketId, fullContent);
        break;
      case 'HR Support':
        await hrSupportAgent(socket, ticketId, fullContent);
        break;
      case 'Finance Support':
        await financeSupportAgent(socket, ticketId, fullContent);
        break;
      default:
        await generalInquiryAgent(socket, ticketId, fullContent);
    }
  }
}

// PHISHING GUARD AGENT - Specialized Security Agent
async function phishingGuardAgent(socket, ticketId, fullContent) {
  await emitLog(socket, ticketId, '🛡️ PhishGuard Agent activated for security threat analysis...', 'PhishGuard Agent');
  await delay(1000);

  // Analyze the phishing threat
  await emitLog(socket, ticketId, '🔍 Scanning email content for malicious indicators and threat patterns', 'PhishGuard Agent');
  await delay(2000);
  
  // Extract malicious elements from the full content
  const lowerContent = fullContent.toLowerCase();
  let threatDetails = [];
  
  if (lowerContent.includes('congratulations') && lowerContent.includes('won')) {
    threatDetails.push('Prize scam pattern detected');
  }
  if (lowerContent.includes('click') && lowerContent.includes('link')) {
    threatDetails.push('Malicious link redirection attempt');
  }
  if (lowerContent.includes('fish.com') || lowerContent.includes('suspicious')) {
    threatDetails.push('Suspicious domain identified');
  }
  if (lowerContent.includes('redeem') || lowerContent.includes('claim')) {
    threatDetails.push('Social engineering technique: urgency/greed exploitation');
  }
  if (lowerContent.includes('laptop') && (lowerContent.includes('control') || lowerContent.includes('pop-up') || lowerContent.includes('remote'))) {
    threatDetails.push('Device compromise indicators detected');
  }

  await emitLog(socket, ticketId, `⚠️ THREAT IDENTIFIED: ${threatDetails.join(', ')}`, 'PhishGuard Agent');
  await delay(1500);

  // Block malicious URLs
  await emitLog(socket, ticketId, '🚫 Implementing immediate firewall rules to block identified malicious domains and URLs', 'PhishGuard Agent');
  await delay(2000);
  await emitLog(socket, ticketId, '✅ Malicious domains blocked: fish.com, phishing-site.com', 'PhishGuard Agent');
  await delay(1000);

  // Search and destroy similar emails
  await emitLog(socket, ticketId, '🧹 Initiating enterprise-wide search and elimination of similar phishing threats', 'PhishGuard Agent');
  await delay(2500);
  await emitLog(socket, ticketId, '✅ Found and removed 23 similar phishing emails from user inboxes', 'PhishGuard Agent');
  await delay(1000);

  // Quarantine and report
  await emitLog(socket, ticketId, '🔒 Isolating threat samples in secure sandbox environment for detailed analysis', 'PhishGuard Agent');
  await delay(1500);
  await emitLog(socket, ticketId, '📊 Compiling comprehensive threat intelligence report with IOCs and remediation steps', 'PhishGuard Agent');
  await delay(1500);

  // Final resolution
  await emitLog(socket, ticketId, '🎯 SECURITY INCIDENT RESOLVED: Phishing threat neutralized and network protected', 'PhishGuard Agent');
  await emitLog(socket, ticketId, '📋 Recommendation: User security awareness training scheduled', 'PhishGuard Agent');
}

// Knowledge base for common IT issues
function getKnowledgeBaseSolution(fullContent) {
  const lowerContent = fullContent.toLowerCase();
  
  if (lowerContent.includes('email') || lowerContent.includes('outlook') || lowerContent.includes('mail')) {
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
  
  if (lowerContent.includes('password') || lowerContent.includes('reset') || lowerContent.includes('login')) {
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
  
  if (lowerContent.includes('wifi') || lowerContent.includes('network') || lowerContent.includes('internet')) {
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
  
  if (lowerContent.includes('software') || lowerContent.includes('install') || lowerContent.includes('application')) {
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
  
  if (lowerContent.includes('printer') || lowerContent.includes('print')) {
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
async function itSupportAgent(socket, ticketId, fullContent) {
  await emitLog(socket, ticketId, '🔧 IT Support Agent activated for technical assistance...', 'IT Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, '🔍 Performing comprehensive technical analysis and system diagnostics', 'IT Support Agent');
  await delay(2000);

  // Get specific IT solution
  const solution = getKnowledgeBaseSolution(fullContent);
  
  await emitLog(socket, ticketId, '💡 Technical solution identified from knowledge base', 'IT Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, `🎯 TECHNICAL RESOLUTION: ${solution.solution}`, 'IT Support Agent');
  await delay(1000);

  // Provide detailed technical steps
  for (let i = 0; i < solution.steps.length; i++) {
    await emitLog(socket, ticketId, `⚙️ Step ${i + 1}: ${solution.steps[i]}`, 'IT Support Agent');
    await delay(900);
  }

  await emitLog(socket, ticketId, '🔧 Executing comprehensive system diagnostics and automated configuration validation', 'IT Support Agent');
  await delay(2000);
  await emitLog(socket, ticketId, '✅ System validation complete. Configuration applied successfully', 'IT Support Agent');
  await emitLog(socket, ticketId, '📞 Follow-up scheduled in 24 hours to ensure resolution', 'IT Support Agent');
}

// HR SUPPORT AGENT - Human Resources Specialist  
async function hrSupportAgent(socket, ticketId, fullContent) {
  await emitLog(socket, ticketId, '👥 HR Support Agent activated for employee assistance...', 'HR Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, '📋 Conducting thorough review of employee request against current company policies and procedures', 'HR Support Agent');
  await delay(2000);

  const lowerContent = fullContent.toLowerCase();
  let hrResponse = {};

  if (lowerContent.includes('leave') || lowerContent.includes('vacation')) {
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
  } else if (lowerContent.includes('payroll') || lowerContent.includes('salary')) {
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
  } else if (lowerContent.includes('benefits') || lowerContent.includes('insurance')) {
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
    await emitLog(socket, ticketId, `📋 ${hrResponse.actions[i]}`, 'HR Support Agent');
    await delay(1200);
  }

  await emitLog(socket, ticketId, '✅ HR request processed successfully', 'HR Support Agent');
  await emitLog(socket, ticketId, '📧 Official HR response sent to employee email', 'HR Support Agent');
}

// FINANCE SUPPORT AGENT - Financial Operations Specialist
async function financeSupportAgent(socket, ticketId, fullContent) {
  await emitLog(socket, ticketId, '💰 Finance Support Agent activated for financial assistance...', 'Finance Support Agent');
  await delay(1000);

  await emitLog(socket, ticketId, '📊 Analyzing financial request and validating against company procedures and compliance requirements', 'Finance Support Agent');
  await delay(2000);

  const lowerContent = fullContent.toLowerCase();
  let financeResponse = {};

  if (lowerContent.includes('invoice') || lowerContent.includes('billing')) {
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
  } else if (lowerContent.includes('expense') || lowerContent.includes('reimbursement')) {
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
  } else if (lowerContent.includes('budget') || lowerContent.includes('financial')) {
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
    await emitLog(socket, ticketId, `💼 ${financeResponse.actions[i]}`, 'Finance Support Agent');
    await delay(1200);
  }

  await emitLog(socket, ticketId, '✅ Financial request processed successfully', 'Finance Support Agent');
  await emitLog(socket, ticketId, '📈 Financial documentation sent for records', 'Finance Support Agent');
}

async function generalInquiryAgent(socket, ticketId, fullContent) {
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

async function processTicket(socket, ticketId, fullContent) {
  // Master Agent handles all classification and routing internally
  await masterAgentTriage(socket, ticketId, fullContent);

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
    const { ticket_subject, ticket_description } = data;
    const ticketId = generateTicketId();

    // Combine subject and description for better AI processing
    const fullTicketContent = ticket_description 
      ? `${ticket_subject}. Additional details: ${ticket_description}`
      : ticket_subject;

    console.log(`Creating ticket ${ticketId}: ${ticket_subject}`);
    if (ticket_description) {
      console.log(`Description: ${ticket_description}`);
    }

    const { error } = await supabase.from('tickets').insert({
      id: ticketId,
      subject: ticket_subject,
      description: ticket_description || null,
      status: 'Processing'
    });

    if (error) {
      console.error('Error creating ticket:', error);
      socket.emit('error', { message: 'Failed to create ticket' });
      return;
    }

    socket.emit('ticket_created', { ticketId, subject: ticket_subject, status: 'Processing' });

    processTicket(socket, ticketId, fullTicketContent);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.use((req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log('Serving index.html from:', indexPath);
  console.log('Request URL:', req.url);
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
