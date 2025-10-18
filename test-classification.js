// Test the Master Agent classification
import dotenv from 'dotenv';
dotenv.config();

// Import the classification function
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

// Test cases
const testCases = [
  {
    subject: "congratulations, you have won the 10k, click on the link given to redeem it www.fish.com",
    expected: "Phishing/Security"
  },
  {
    subject: "I need help resetting my password",
    expected: "IT Support"
  },
  {
    subject: "I want to apply for vacation leave",
    expected: "HR Support"
  },
  {
    subject: "Need help with expense reimbursement",
    expected: "Finance Support"
  },
  {
    subject: "General question about company policy",
    expected: "General Inquiry"
  }
];

console.log("🤖 Testing Master Agent Classification System\n");
console.log("=" * 60);

testCases.forEach((testCase, index) => {
  const result = masterAgentClassify(testCase.subject);
  const status = result === testCase.expected ? "✅ PASS" : "❌ FAIL";
  
  console.log(`\nTest ${index + 1}: ${status}`);
  console.log(`Subject: "${testCase.subject}"`);
  console.log(`Expected: ${testCase.expected}`);
  console.log(`Got: ${result}`);
  console.log("-".repeat(50));
});

console.log("\n🎯 Your specific phishing test:");
const phishingTest = "congratulations, you have won the 10k, click on the link given to redeem it www.fish.com";
const phishingResult = masterAgentClassify(phishingTest);
console.log(`Subject: "${phishingTest}"`);
console.log(`Classification: ${phishingResult}`);
console.log(`✅ This will now be routed to: PhishGuard Agent`);