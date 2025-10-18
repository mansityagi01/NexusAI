# 🤖 NexusAI - Advanced Multi-Agent AI Platform

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🚀 Overview

NexusAI is an intelligent, multi-agent AI operations system that automatically triages and resolves security threats while providing comprehensive support across IT, HR, and Finance domains. Built with React, Node.js, Socket.IO, and featuring advanced AI integration with **Ollama (Local AI)**, Google Gemini Pro fallback, and enhanced rule-based classification.

## ✨ Features

### 🧠 **Advanced Multi-AI Classification**
- **Ollama Integration**: Primary local AI model (Llama 2) for fast, offline classification
- **Google Gemini Pro**: Cloud AI fallback for enhanced accuracy when available
- **Enhanced Rule-Based System**: Comprehensive keyword matching with scoring algorithm
- **Triple-Layer Security**: Primary → Secondary → Fallback classification ensures 99.9% uptime

### 🛡️ **PhishGuard Agent - Security Specialist**
- **Advanced Threat Detection**: Multi-pattern phishing recognition
- **Real-time URL Analysis**: Malicious domain identification and blocking
- **Automated Remediation**: Quarantine threats and protect network infrastructure
- **Threat Intelligence**: Comprehensive IOC analysis and reporting

### 🔧 **IT Support Agent - Technical Specialist**
- **Password & Access Management**: Automated reset workflows and diagnostics
- **Email & Network Support**: Configuration guidance and troubleshooting
- **Software & Hardware Issues**: Installation support and maintenance procedures
- **System Diagnostics**: Automated health checks and performance optimization

### 👥 **HR Support Agent - Employee Services**
- **Leave Management**: Vacation, sick leave, and PTO processing
- **Payroll Support**: Salary inquiries and benefits administration
- **Policy Compliance**: Employee handbook and procedure guidance
- **Workplace Resolution**: Harassment and grievance handling protocols

### 💰 **Finance Support Agent - Financial Operations**
- **Invoice Processing**: Automated billing and payment workflows
- **Expense Management**: Reimbursement processing and approval chains
- **Budget Analysis**: Financial reporting and variance analysis
- **Vendor Relations**: Supplier management and procurement support

### 🔄 **Real-time Multi-Agent Orchestration**
- **Master Agent**: Intelligent routing with AI-powered decision making
- **Live Workflow Visualization**: Real-time agent communication logs
- **WebSocket Communication**: Sub-second response times and status updates
- **Agent Collaboration**: Seamless handoffs between specialized domains

## 🛠️ Advanced Tech Stack

### **AI & Machine Learning**
- **Ollama**: Local AI inference with Llama 2 model
- **Google Gemini Pro**: Cloud AI for enhanced classification accuracy
- **Custom Rule Engine**: Advanced pattern matching with scoring algorithms
- **Natural Language Processing**: Multi-domain text analysis and classification

### **Backend Architecture**
- **Node.js + Express**: Scalable server with microservices design
- **Socket.IO**: Real-time bidirectional communication
- **Multi-AI Integration**: Ollama + Gemini + Rule-based fallback system
- **Error Handling**: Graceful degradation and automatic failover

### **Frontend Experience**
- **React 18**: Modern component architecture with concurrent features
- **TypeScript**: Type-safe development with enhanced IDE support
- **Tailwind CSS**: Utility-first responsive design system
- **Vite**: Lightning-fast development and optimized production builds

### **Data & Deployment**
- **Supabase**: PostgreSQL with real-time subscriptions
- **Render**: Production-ready cloud deployment with CI/CD
- **Environment Management**: Secure configuration and secrets handling
- **Monitoring**: Health checks and performance metrics

## 🚀 Quick Start

### Prerequisites

#### Ollama Setup (Local AI - Recommended)
```bash
# Install Ollama (Windows/Mac/Linux)
# Visit: https://ollama.ai/download

# Pull Llama 2 model (required for local AI)
ollama pull llama2

# Verify Ollama is running
curl http://localhost:11434/api/version
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/mansityagi01/NexusAI.git
cd NexusAI

# Install dependencies
npm install

# Start Ollama service (in separate terminal)
ollama serve

# Start backend server
node server/index.js

# In a new terminal, start the frontend  
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Google Gemini API (for enhanced cloud AI fallback)
GEMINI_API_KEY=your_gemini_api_key_here

# Required: Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Ollama Configuration (defaults work for standard setup)
OLLAMA_BASE_URL=http://localhost:11434

# Optional: Server Configuration
PORT=3001
NODE_ENV=development
```

### Production Deployment (Render)

1. **Fork this repository** to your GitHub account

2. **Install Ollama on your server** (recommended for best performance):
   ```bash
   # For Docker-based deployment
   docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
   docker exec -it ollama ollama pull llama2
   ```

3. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Create a new "Web Service"
   - Connect your forked repository

4. **Configure Build Settings**:
   ```yaml
   Build Command: npm install && npm run build
   Start Command: node server/index.js
   ```

5. **Set Environment Variables** in Render dashboard:
   - `GEMINI_API_KEY`: Your Google AI API key (optional but recommended)
   - `SUPABASE_URL`: Your Supabase project URL  
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `OLLAMA_BASE_URL`: Your Ollama service URL (if using external Ollama)
   - `NODE_ENV`: production

6. **Deploy**: Render will automatically build and deploy your application

## 🔧 Configuration

### Ollama Setup (Primary AI - Recommended)
1. **Install Ollama**: Visit [ollama.ai](https://ollama.ai/download) and install for your platform
2. **Pull Llama 2 model**: `ollama pull llama2`
3. **Start Ollama service**: `ollama serve` (runs on localhost:11434 by default)
4. **Verify installation**: `curl http://localhost:11434/api/version`

### Google Gemini AI Setup (Fallback AI - Optional)
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the key to your environment variables as `GEMINI_API_KEY`

### Supabase Setup  
1. Create account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Copy your project URL and anon key to environment variables
4. Run the migration file in `supabase/migrations/` to set up the database schema

## 🏗️ Architecture

### Advanced Multi-AI System
- **Primary AI**: Ollama (Local Llama 2) for fast, offline classification
- **Secondary AI**: Google Gemini Pro for enhanced accuracy when available
- **Fallback System**: Enhanced rule-based classification with comprehensive keyword scoring
- **Master Agent**: Intelligent routing with triple-layer AI decision making

### Specialized Agent Network
- **PhishGuard Agent**: Advanced security threat detection and remediation
- **IT Support Agent**: Comprehensive technical support and diagnostics
- **HR Support Agent**: Employee services and policy compliance
- **Finance Support Agent**: Financial operations and vendor management

### Real-time Communication
- WebSocket connections for sub-second response times
- Server-sent events for ticket status changes
- Live multi-agent communication logs
- Connection health monitoring and auto-reconnection

### AI Integration
- **Local AI Processing**: Ollama for privacy-conscious, offline classification
- **Cloud AI Enhancement**: Gemini Pro for complex reasoning tasks
- **Intelligent Fallback**: Enhanced rule-based system with scoring algorithms
- **Domain Specialization**: Custom prompt engineering for each agent domain

### **Performance & Optimization**

#### **Response Times**
- **Ollama Local AI**: 2-5 seconds (can be optimized)
- **Gemini Cloud AI**: <1 second (when available)  
- **Rule-based Fallback**: <100ms (guaranteed)
- **WebSocket Communication**: <50ms latency

#### **Optimization Strategies**
- **GPU Acceleration**: Reduce Ollama processing to <1 second
- **Model Quantization**: Smaller models for faster inference
- **Container Deployment**: Docker with optimized Ollama setup
- **Cloud Deployment**: Render/AWS with dedicated AI instances
- **Caching**: Pre-computed responses for common queries

#### **Production Recommendations**
```bash
# For fastest performance in production:
# 1. Use GPU-enabled instances
# 2. Deploy with Docker containers  
# 3. Enable model caching
# 4. Configure load balancing for high traffic
```

### 🛡️ Security Operations
- **Multi-pattern Threat Detection**: URL scanning, domain analysis, content inspection
- **Automated Threat Response**: Real-time quarantine and network protection
- **Advanced Phishing Detection**: ML-powered social engineering identification
- **Security Incident Management**: Comprehensive logging and reporting

### 🔧 IT Support Operations  
- **Intelligent Diagnostics**: Automated system health checks and troubleshooting
- **Password & Access Management**: Secure reset workflows and privilege management
- **Software & Hardware Support**: Installation guidance and maintenance procedures
- **Network Configuration**: Email setup, VPN configuration, and connectivity support

### 👥 HR Support Operations
- **Employee Lifecycle Management**: Onboarding, leave processing, and exit procedures
- **Payroll & Benefits Administration**: Salary inquiries and benefits management
- **Policy Compliance**: Handbook guidance and procedure clarification
- **Workplace Resolution**: Harassment reporting and grievance handling

### 💰 Finance Support Operations
- **Automated Invoice Processing**: Billing workflows and payment automation
- **Expense Management**: Reimbursement processing and approval chains
- **Financial Reporting**: Budget analysis and variance reporting
- **Vendor & Procurement Management**: Supplier relations and purchasing support

### 🔄 Workflow Management
- **AI-Powered Routing**: Intelligent ticket classification and agent assignment
- **Priority-Based Processing**: Automated urgency assessment and queue management
- **Escalation Protocols**: Seamless handoff to human agents when needed
- **Performance Analytics**: Response time tracking and resolution metrics

## 🧪 Demo & Testing

Try these example inputs to see NexusAI in action:

### 🛡️ Security Scenarios (Auto-Resolved)
- *"Suspicious phishing email detected from suspicious-domain.com"*
- *"Malware alert on workstation - need immediate quarantine"* 
- *"Security breach notification - unauthorized access detected"*

### 🔧 IT Support Scenarios (Guided Solutions)
- *"Need help configuring Outlook for company email"*
- *"Forgot my password and can't access the system"*
- *"Unable to connect to office WiFi network"*
- *"Printer not responding to print jobs"*

### 👥 HR Support Scenarios
- *"Need to submit vacation request for next week"*
- *"Questions about health insurance benefits"*
- *"How to report workplace harassment incident"*

### 💰 Finance Support Scenarios
- *"Need reimbursement for business travel expenses"*
- *"Invoice approval workflow question"*
- *"Budget variance analysis request"*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://nexusai-production.onrender.com/)
- [Documentation](https://github.com/mansityagi01/NexusAI/wiki)
- [Issues](https://github.com/mansityagi01/NexusAI/issues)
- [Discussions](https://github.com/mansityagi01/NexusAI/discussions)
- [Ollama Documentation](https://ollama.ai/docs)

---

<div align="center">
  <p>Built with ❤️ for autonomous AI operations</p>
  <p>🚀 <strong>Deploy instantly</strong> • 🛡️ <strong>Secure by default</strong> • ⚡ <strong>Lightning fast</strong> • 🧠 <strong>AI-powered</strong></p>
</div>