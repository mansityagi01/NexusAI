# Simplified Render Deployment Configuration

# This is an alternative to the render.yaml file
# Use this if you prefer manual deployment

## Backend Web Service Configuration:
- **Type**: Web Service
- **Name**: nexusai-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: Yes

## Frontend Static Site Configuration:
- **Type**: Static Site  
- **Name**: nexusai-frontend
- **Build Command**: `npm install && npm run build`
- **Publish directory**: `dist`
- **Auto-Deploy**: Yes

## Important Notes:
1. Deploy backend service first
2. Get the backend URL from Render dashboard
3. Update frontend VITE_SERVER_URL environment variable with backend URL
4. Deploy frontend service second