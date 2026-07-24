# 🚀 Combined Frontend-Backend Startup Guide

This guide explains how to start and test the combined frontend and backend system.

## 📋 Prerequisites

Make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- SQLite (comes with Node.js)

## 🔧 Setup Steps

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Return to project root
cd ..
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Create frontend environment file
# (Optional - .env.local already exists with defaults)
```

## 🚀 Starting the Application

### Option A: Start Both Together (Recommended)

```bash
# This starts both backend (port 3001) and frontend (port 3000)
npm run dev
```

### Option B: Start Separately

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Option C: Frontend Only (Development)

```bash
# For frontend-only work
npm run dev:frontend-only
```

## 🧪 Testing the Setup

Run the test script to verify everything is working:

```bash
node start-test.js
```

Expected output:
```
🧪 Testing Combined Frontend-Backend Setup

1. Testing backend server...
   ✅ Backend is running correctly
   📊 Service: local-backend, Version: 1.0.0

2. Testing API endpoints...
   ✅ Root endpoint (200)
   ✅ API base (404 or 200)
   📊 2/2 endpoints working

3. Checking configuration...
   ✅ Frontend environment: .env.local
   ✅ Backend environment: server/.env
   ✅ Local API client: src/api/localClient.js
   ✅ Base44 compatibility layer: src/api/base44Compatibility.js
   📊 4/4 configuration files present

🎉 ALL TESTS PASSED!
```

## 🌐 Access the Application

Once running, access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔍 Verification Steps

### 1. Backend Verification

```bash
curl http://localhost:3001/health
```
Should return:
```json
{"status":"ok","timestamp":"...","service":"local-backend","version":"1.0.0"}
```

### 2. Frontend Verification

Open http://localhost:3000 in your browser. You should see:
- The portfolio website
- Contact form
- Meeting scheduling page

### 3. API Verification

```bash
curl http://localhost:3001/
```
Should return API documentation.

## 🐛 Troubleshooting

### Common Issues:

#### 1. Backend won't start
```bash
cd server
npm run dev
```
Check for error messages in the terminal.

#### 2. Database errors
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

#### 3. CORS errors
Check `server/.env`:
```
CORS_ORIGIN=http://localhost:3000
```

#### 4. Frontend can't connect to backend
Check `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

#### 5. Port conflicts
Change ports in:
- Backend: `server/.env` (PORT=3001)
- Frontend: `vite.config.js` (if needed)

## 📊 Monitoring

### Backend Logs
Check the terminal where `npm run dev:backend` is running.

### Frontend Logs
Open browser developer console (F12).

### Database
```bash
cd server
npx prisma studio
```
Opens database GUI at http://localhost:5555

## 🔄 Development Workflow

1. **Make changes to backend**: Files in `server/src/`
2. **Backend auto-reloads** thanks to `tsx watch`
3. **Make changes to frontend**: Files in `src/`
4. **Frontend auto-reloads** thanks to Vite
5. **Test changes**: Refresh browser at http://localhost:3000

## 🗑️ Cleanup

To stop all services:
- Press `Ctrl+C` in both terminals
- Or kill the processes:
  ```bash
  # Find and kill Node processes
  pkill -f "node.*(vite|tsx)"
  ```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for errors
3. Verify all setup steps were completed
4. Check `server/README.md` for detailed backend documentation

---

**🎉 Your combined frontend-backend system is now ready!**