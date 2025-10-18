# 🚀 NEXUSAI - SCREENSHOT DEMO GUIDE
## Complete Commands to Run and Screenshot Your Project

---

## **STEP 1: PREPARE THE PROJECT**

### **Open Command Prompt/PowerShell in Project Directory**
```cmd
cd "C:\Users\ASUS\Downloads\Nexus_AI\project"
```

### **Install Dependencies (if needed)**
```cmd
npm install
```

### **Build the Frontend**
```cmd
npm run build
```

---

## **STEP 2: START THE SERVER**

### **Start the Production Server**
```cmd
set NODE_ENV=production && node server/index.js
```

**OR use PowerShell syntax:**
```powershell
$env:NODE_ENV="production"; node server/index.js
```

**Expected Output:**
```
[dotenv@17.2.3] injecting env (3) from .env
Server running on localhost:3001
Environment: production
```

---

## **STEP 3: ACCESS THE APPLICATION**

### **Open Your Web Browser**
Navigate to: `http://localhost:3001`

---

## **STEP 4: SCREENSHOT CHECKLIST**

### **📸 Screenshot 1: Main Dashboard**
- URL: `http://localhost:3001`
- Show: Clean interface with "Create New Support Ticket" form
- Capture: Full page showing the NexusAI branding and form layout

### **📸 Screenshot 2: Ticket Submission Form**
- Fill in the form with your phishing test case:
  - **Subject**: `congratulations, you have won the 10k, click on the link given to redeem it www.fish.com`
  - **Description**: `I received this suspicious email claiming I won money. Please investigate.`
- Capture: Form filled out, ready to submit

### **📸 Screenshot 3: Master Agent Classification**
- Click "Submit Ticket" button
- Capture: Live logs showing:
  ```
  🤖 Master Agent activated for ticket classification...
  🧠 AI Classification: Phishing/Security
  📋 Rule-based Classification: Phishing/Security
  ✅ Final Classification: Phishing/Security
  🚀 Routing ticket to Phishing/Security Agent...
  ```

### **📸 Screenshot 4: PhishGuard Agent Response**
- Capture: Detailed security analysis logs:
  ```
  🛡️ PhishGuard Agent activated for security threat analysis...
  🔍 Analyzing email for Indicators of Compromise (IOCs)...
  ⚠️ THREAT IDENTIFIED: Prize scam pattern detected, Malicious link redirection attempt
  🚫 Executing: Block malicious URLs at firewall level...
  ✅ Malicious domains blocked: fish.com, phishing-site.com
  🎯 SECURITY INCIDENT RESOLVED: Phishing threat neutralized and network protected
  ```

### **📸 Screenshot 5: Complete Workflow**
- Capture: Full page showing the entire ticket processing workflow from start to finish
- Show: Real-time logs with all agent interactions

---

## **STEP 5: TEST DIFFERENT TICKET TYPES**

### **📸 Screenshot 6: IT Support Ticket**
- **Subject**: `I need help resetting my password`
- **Expected Route**: IT Support Agent
- Capture: IT Support Agent processing with technical solutions

### **📸 Screenshot 7: HR Support Ticket**
- **Subject**: `I want to apply for vacation leave`
- **Expected Route**: HR Support Agent
- Capture: HR Agent processing leave request

### **📸 Screenshot 8: Finance Support Ticket**
- **Subject**: `Need help with expense reimbursement`
- **Expected Route**: Finance Support Agent
- Capture: Finance Agent handling expense processing

---

## **STEP 6: BROWSER DEVELOPER TOOLS**

### **📸 Screenshot 9: Network Activity**
1. Press `F12` to open Developer Tools
2. Go to "Network" tab
3. Submit a ticket
4. Capture: WebSocket connections and real-time communication

### **📸 Screenshot 10: Console Logs**
1. Go to "Console" tab in Developer Tools
2. Submit a ticket
3. Capture: Real-time JavaScript logs and Socket.IO events

---

## **STEP 7: DATABASE VERIFICATION**

### **Access Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to "Table Editor"
3. Check "tickets" and "logs" tables

### **📸 Screenshot 11: Database Records**
- Capture: Tickets table showing created tickets with status updates
- Show: Real data persistence

### **📸 Screenshot 12: Logs Table**
- Capture: Logs table showing all agent interactions and messages
- Show: Complete audit trail

---

## **STEP 8: MOBILE RESPONSIVENESS**

### **📸 Screenshot 13: Mobile View**
1. Press `F12` in browser
2. Click device toggle icon (phone/tablet icon)
3. Select "iPhone 12 Pro" or similar
4. Capture: Mobile-responsive design

---

## **STEP 9: PERFORMANCE TESTING**

### **📸 Screenshot 14: Response Times**
1. Use browser Developer Tools
2. Go to "Performance" tab
3. Record while submitting ticket
4. Capture: Performance metrics showing fast response times

---

## **STEP 10: GITHUB REPOSITORY**

### **📸 Screenshot 15: GitHub Repo**
- URL: `https://github.com/mansityagi01/NexusAI`
- Capture: Repository showing all your code, commits, and documentation

---

## **TROUBLESHOOTING COMMANDS**

### **If Server Won't Start:**
```cmd
taskkill /F /IM node.exe
npm run build
node server/index.js
```

### **If Port is Busy:**
```cmd
netstat -ano | findstr :3001
taskkill /F /PID [PID_NUMBER]
```

### **Check if Build Exists:**
```cmd
dir dist
```

### **If Dist Folder Missing:**
```cmd
npm run build
dir dist
```

---

## **SCREENSHOT NAMING CONVENTION**

Save your screenshots with these names for easy organization:

1. `01-main-dashboard.png`
2. `02-ticket-form-filled.png`
3. `03-master-agent-classification.png`
4. `04-phishguard-agent-response.png`
5. `05-complete-workflow.png`
6. `06-it-support-agent.png`
7. `07-hr-support-agent.png`
8. `08-finance-support-agent.png`
9. `09-network-websockets.png`
10. `10-console-logs.png`
11. `11-database-tickets.png`
12. `12-database-logs.png`
13. `13-mobile-responsive.png`
14. `14-performance-metrics.png`
15. `15-github-repository.png`

---

## **PRO TIPS FOR GREAT SCREENSHOTS**

1. **Full Screen**: Use full-screen browser for clean captures
2. **Clean Background**: Close unnecessary browser tabs
3. **High Resolution**: Use 1920x1080 or higher resolution
4. **Good Lighting**: Ensure screen is clearly visible
5. **Multiple Angles**: Capture both overview and detail shots
6. **Real Data**: Use realistic test data for authenticity

---

## **DEMO SCRIPT FOR PRESENTATION**

### **Live Demo Sequence:**
1. Show clean dashboard interface
2. Enter phishing test case
3. Watch Master Agent classify in real-time
4. Observe PhishGuard Agent detailed analysis
5. Highlight real-time WebSocket communication
6. Show database persistence
7. Demonstrate different ticket types

### **Key Points to Emphasize:**
- Real-time processing speed
- Accurate AI classification
- Specialized agent expertise
- Enterprise-ready architecture
- Production deployment capability

---

**🎯 You're ready to capture amazing screenshots that showcase your NexusAI project's capabilities!**