# 🚀 Single Web Service Deployment Guide

## 📋 Overview
NexusAI is now configured as a **unified web service** that serves both frontend and backend from a single URL.

## ✅ What Changed
- ✅ Server now serves static React files from `/dist` folder
- ✅ Single web service configuration in `render.yaml`
- ✅ Same-origin Socket.IO connections (no CORS issues)
- ✅ Unified build process
- ✅ One URL for everything

## 🛠️ Build Commands for Render

### **Build Command:**
```bash
npm install && npm run build
```

### **Start Command:**
```bash
npm start
```

## 🌐 Deployment Instructions

### Step 1: Commit Changes
All changes are ready in your repository.

### Step 2: Deploy to Render

#### Option A: Blueprint Deployment (Automatic)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +" → "Blueprint"**
3. Connect your GitHub repository: `mansityagi01/NexusAI`
4. Render auto-detects `render.yaml`
5. Set environment variables (see below)
6. Click **"Apply"**

#### Option B: Manual Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +" → "Web Service"**
3. Connect repository: `mansityagi01/NexusAI`
4. Configure:
   - **Name**: `nexusai`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables

Add these in Render service settings:

```env
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://tgfwlcooihvfwhbekimi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY
GOOGLE_GEMINI_API_KEY=AIzaSyB0rBIFmdOIDKJAxdxQ_eG49s3A6oUW2wQ
```

## 🎯 Expected Result

After deployment, you'll get **ONE URL** that provides:
- ✅ **Frontend React App** (served from `/`)
- ✅ **Backend API** (available at `/api/*`)
- ✅ **Socket.IO** (same origin, no CORS issues)
- ✅ **Health Check** (available at `/health`)

**Example URL**: `https://nexusai.onrender.com`

## 🧪 Testing

Once deployed, visit your single URL and:
1. **Frontend loads** - React interface appears
2. **Connection status** - Shows "Connected" 
3. **Submit ticket** - "Suspicious email detected"
4. **Real-time updates** - Watch agent processing
5. **Final result** - Ticket resolved/escalated

## ⚡ Quick Deploy Checklist

- [ ] Environment variables set in Render
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Service type: Web Service
- [ ] Plan: Free (or paid for better performance)

## 🔍 Troubleshooting

If deployment fails:
1. **Check build logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Ensure** `package.json` is in root directory
4. **Check** Node.js version (project uses Node 18+)

## 🎉 Success!

After successful deployment:
- **Single URL** serves everything
- **No separate frontend/backend** URLs needed
- **Real-time functionality** works perfectly
- **Complete AI-powered** IT operations system

---

**🚀 Your unified NexusAI web service is ready for deployment!**