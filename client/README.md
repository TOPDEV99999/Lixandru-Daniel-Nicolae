# Portfolio & Meeting Scheduling App

This application has been migrated from Base44 to a standalone React + Node.js/Express backend.

## Local Backend Migration Status ✅

The project has been successfully migrated from Base44 dependencies to a local backend system. Here's what's been implemented:

### ✅ Completed Migration Tasks:
1. **Foundation Setup** - Removed Base44 dependencies, set up local backend structure
2. **Core Backend Infrastructure** - Express.js server with TypeScript, routing, error handling
3. **Database Layer** - SQLite with Prisma ORM, repository pattern, Zod validation
4. **Authentication System** - JWT-based auth with role-based access control
5. **API Endpoint Migration** - All Base44 functions converted to local endpoints
6. **Frontend Integration** - New API client, auth context, error handling
7. **Development Environment** - Complete setup with testing and monitoring

### 🔧 Technical Stack:
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **API Client**: Axios with interceptors

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd portfolio-meeting-app
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Development

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001

### Backend Setup

1. **Configure environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

### Frontend Only (Development)
```bash
npm run dev:frontend-only
```

### Backend Only (Development)
```bash
npm run dev:backend
```

## 📁 Project Structure

```
├── server/                 # Node.js/Express backend
│   ├── prisma/            # Database schema & migrations
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── repositories/  # Data access interfaces
│   │   ├── services/      # Business logic
│   │   ├── validation/    # Zod validation schemas
│   │   └── index.ts       # Server entry point
│   └── README.md          # Backend documentation
├── src/                   # React frontend
│   ├── api/              # API client (replaces Base44 SDK)
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth, etc.)
│   └── App.jsx           # Main app component
└── package.json          # Root package.json with concurrent scripts
```

## 🔐 Authentication

The app now uses local JWT-based authentication:

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Protected Routes**: Use `Authorization: Bearer <token>` header

### User Roles:
- **User**: Can submit forms and view own data
- **Admin**: Full access to all data and admin features

## 📊 API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/meeting` - Schedule a meeting
- `POST /api/availability` - Check available time slots
- `POST /api/visit` - Track visitor analytics

### Protected Endpoints (Authentication Required)
- `GET /api/contact` - View contact messages (admin)
- `GET /api/meeting` - View meeting requests
- `GET /api/admin/*` - Admin dashboard endpoints

## 🗄️ Database

The app uses **SQLite** for local development with **Prisma ORM**:

### Models:
- **User** - Authentication and user management
- **ContactMessage** - Contact form submissions
- **MeetingRequest** - Meeting scheduling
- **Visitor** - Visitor analytics tracking

### Database Management:
```bash
cd server
npx prisma studio     # Database GUI
npx prisma migrate    # Run migrations
npx prisma generate   # Generate Prisma client
```

## 🧪 Testing

Test the backend server:
```bash
cd server
node test-server.js
```

## 🔧 Configuration

### Environment Variables (Frontend)
Create `.env.local` in project root:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Environment Variables (Backend)
See `server/.env.example` for required variables.

## 🚨 Troubleshooting

### Common Issues:

1. **Database connection errors:**
   - Ensure SQLite database file exists and is writable
   - Run `npx prisma migrate dev` to create database

2. **JWT authentication errors:**
   - Verify `JWT_SECRET` is set in backend `.env` file
   - Check token expiration

3. **CORS errors:**
   - Ensure frontend URL matches `CORS_ORIGIN` in backend `.env`

4. **API client errors:**
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check backend server is running on port 3001

### Development Tools:
- **Backend logs**: Check terminal running `npm run dev:backend`
- **Frontend logs**: Browser developer console
- **API testing**: Use Postman or curl to test endpoints directly

## 📚 Documentation

### Backend Documentation
See `server/README.md` for detailed backend setup, API documentation, and database schema.

### Migration Documentation
The migration plan and progress tracking are documented in `.kiro/specs/local-backend-integration/tasks.md`.

### API Documentation
Run the backend server and visit http://localhost:3001 for interactive API documentation.

## 🆘 Support

### Development Issues
1. Check the troubleshooting section above
2. Review server logs for error details
3. Verify all prerequisites are installed

### Database Issues
- Use `npx prisma studio` to inspect database
- Check migration history in `server/prisma/migrations/`

### API Issues
- Test endpoints directly with Postman or curl
- Verify authentication tokens are valid
- Check CORS configuration matches frontend URL

## 🎯 Next Steps

### Remaining Frontend Updates
1. Update components to use the new `localClient.js` instead of `base44Client.js`
2. Implement proper error handling and loading states in all components
3. Update environment configuration for production

### Production Deployment
1. Set up production database (PostgreSQL/MySQL)
2. Configure environment variables for production
3. Set up SSL/TLS for API endpoints
4. Implement rate limiting and security headers
5. Configure logging and monitoring

### Feature Enhancements
1. Email notification system
2. File upload functionality
3. Real-time notifications
4. Advanced analytics dashboard
5. Multi-language support

## 📄 License

MIT License - See LICENSE file for details.
