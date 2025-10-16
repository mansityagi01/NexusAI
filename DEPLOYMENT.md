# 🚀 NexusAI Deployment Guide for Render

## 📋 Overview
This guide will help you deploy your NexusAI project to Render with both frontend and backend services.

## 🎯 Deployment Architecture
- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js + Express + Socket.IO (Web Service)
- **Database**: Supabase (External)
- **AI**: Google Gemini API (External)

## 📁 Pre-Deployment Checklist

✅ **Files Created:**
- `render.yaml` - Render configuration
- `Dockerfile` - Container configuration
- `.env.production` - Production environment variables
- `.dockerignore` - Docker ignore file
- Updated `package.json` with production scripts
- Updated server with production configurations

## 🔧 Step-by-Step Deployment Instructions

### Step 1: Prepare Your Repository

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - NexusAI ready for deployment"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub first
   git remote add origin https://github.com/YOUR_USERNAME/nexusai.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Blueprint"**
3. **Connect your GitHub repository**
4. **Select your NexusAI repository**
5. **Render will automatically detect the `render.yaml` file**
6. **Click "Apply"**

#### Option B: Manual Deployment

1. **Deploy Backend Service:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: `nexusai-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

2. **Deploy Frontend Service:**
   - Click "New +" → "Static Site"
   - Connect same repository
   - Configure:
     - **Name**: `nexusai-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Plan**: Free

### Step 3: Configure Environment Variables

#### Backend Service Environment Variables:
Go to your backend service settings and add:

```
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://tgfwlcooihvfwhbekimi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY
GOOGLE_GEMINI_API_KEY=AIzaSyB0rBIFmdOIDKJAxdxQ_eG49s3A6oUW2wQ
```

#### Frontend Service Environment Variables:
```
NODE_ENV=production
VITE_SUPABASE_URL=https://tgfwlcooihvfwhbekimi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY
VITE_SERVER_URL=https://YOUR_BACKEND_SERVICE_NAME.onrender.com
```

**⚠️ Important**: Replace `YOUR_BACKEND_SERVICE_NAME` with your actual backend service URL from Render.

### Step 4: Update CORS Configuration

Once you get your Render URLs, update the CORS configuration in `server/index.js`:

```javascript
// Replace the domain names with your actual Render URLs
origin: [
  'https://your-frontend-name.onrender.com',
  'https://your-backend-name.onrender.com'
]
```

### Step 5: Deploy and Test

1. **Wait for both services to deploy** (usually 5-10 minutes)
2. **Test the application**:
   - Visit your frontend URL: `https://your-frontend-name.onrender.com`
   - Check if it connects to the backend
   - Submit a test ticket to verify functionality

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Update the CORS origins in `server/index.js` with your actual Render URLs
   - Redeploy the backend service

2. **Environment Variables Not Loading**:
   - Check that all environment variables are set in Render dashboard
   - Ensure variable names match exactly

3. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in `package.json`

4. **Socket.IO Connection Issues**:
   - Verify `VITE_SERVER_URL` points to the correct backend URL
   - Check browser console for connection errors

### Health Check Endpoints:
- **Backend Health**: `https://your-backend-name.onrender.com/health`
- **Backend Info**: `https://your-backend-name.onrender.com/api/info`

## 🎉 Success!

Once deployed, your NexusAI application will be available at:
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

## 📱 Features Available After Deployment:
- ✅ Multi-agent AI workflow system
- ✅ Real-time Socket.IO communication
- ✅ Supabase database integration
- ✅ Google Gemini AI classification
- ✅ Rule-based fallback system
- ✅ Responsive web interface
- ✅ Automatic security threat resolution
- ✅ IT support knowledge base

## 🔄 Continuous Deployment

Your application will automatically redeploy when you push changes to your GitHub repository!

## 💡 Pro Tips:
1. **Monitor your services** in the Render dashboard
2. **Check logs** if something isn't working
3. **Use the health endpoints** to verify service status
4. **Set up custom domains** for professional URLs
5. **Consider upgrading** to paid plans for better performance

---

**🎯 Your NexusAI is now ready for the world! 🚀**