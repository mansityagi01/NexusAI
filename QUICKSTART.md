# 🚀 Quick Start Guide

## Local Development
```bash
# Install dependencies
npm install

# Start development server (frontend)
npm run dev

# Start backend server (in another terminal)
npm run server
```

## Production Build Test
```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Test backend
npm start
```

## Deployment URLs (After Render Deployment)
- Frontend: https://nexusai-frontend.onrender.com
- Backend: https://nexusai-backend.onrender.com

## Environment Variables for Render
Copy these to your Render service environment variables:

### Backend Service:
```
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=https://tgfwlcooihvfwhbekimi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY
GOOGLE_GEMINI_API_KEY=AIzaSyB0rBIFmdOIDKJAxdxQ_eG49s3A6oUW2wQ
```

### Frontend Service:
```
NODE_ENV=production
VITE_SUPABASE_URL=https://tgfwlcooihvfwhbekimi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZndsY29vaWh2ZndoYmVraW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTg2MTgsImV4cCI6MjA3NjE5NDYxOH0.Ik63bLcvpp5JftxRSIGNPxWmIMSFmSkqRWtH0WFO5pY
VITE_SERVER_URL=https://YOUR_BACKEND_URL.onrender.com
```