# Local Backend Server

This is the local backend server for the Base44 app migration. It replaces the Base44 dependencies with a standalone Node.js/Express backend.

## Features

- **Express.js** with TypeScript
- **SQLite** database with Prisma ORM
- **JWT-based authentication** with role-based access control
- **API endpoints** migrated from Base44 functions:
  - Contact form submission
  - Meeting scheduling
  - Visitor tracking
  - Admin dashboard
- **Validation** with Zod schemas
- **Repository pattern** for data access
- **Error handling** middleware

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration.

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript code
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Project Structure

```
server/
├── prisma/           # Database schema and migrations
│   └── schema.prisma
├── src/
│   ├── controllers/  # API controllers
│   ├── middleware/   # Express middleware
│   ├── repositories/ # Data access layer interfaces
│   ├── services/     # Business logic
│   ├── validation/   # Zod validation schemas
│   └── index.ts      # Server entry point
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin only)
- `GET /api/contact/:id` - Get specific contact message
- `PUT /api/contact/:id` - Update contact status (admin only)
- `DELETE /api/contact/:id` - Delete contact message (admin only)

### Meeting
- `POST /api/meeting` - Submit meeting request
- `GET /api/meeting` - Get meeting requests
- `GET /api/meeting/:id` - Get specific meeting request
- `POST /api/meeting/:id/respond` - Respond to meeting (admin only)
- `PUT /api/meeting/:id` - Update meeting request
- `DELETE /api/meeting/:id` - Delete meeting request (admin only)

### Availability
- `POST /api/availability` - Check available time slots for a date
- `GET /api/availability/weekly` - Get weekly availability

### Visitor
- `POST /api/visit` - Track visitor
- `GET /api/visit` - Get visitors (admin only)
- `GET /api/visit/analytics` - Get visitor analytics (admin only)
- `GET /api/visit/:id` - Get specific visitor (admin only)
- `DELETE /api/visit/:id` - Delete visitor (admin only)

### Admin
- `GET /api/admin/data` - Get all admin data (admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)

### Health
- `GET /health` - Health check endpoint

## Database Models

### User
- `id` (String, primary key)
- `email` (String, unique)
- `passwordHash` (String)
- `name` (String, optional)
- `role` (String, default: 'user')
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### ContactMessage
- `id` (String, primary key)
- `fullName` (String)
- `email` (String)
- `message` (String)
- `visitorIp` (String, optional)
- `browser` (String, optional)
- `country` (String, optional)
- `status` (String, default: 'new')
- `userId` (String, optional, foreign key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### MeetingRequest
- `id` (String, primary key)
- `customerName` (String)
- `email` (String)
- `company` (String, optional)
- `meetingTopic` (String)
- `requestedDate` (String)
- `requestedTime` (String)
- `notes` (String, optional)
- `visitorIp` (String, optional)
- `browser` (String, optional)
- `country` (String, optional)
- `status` (String, default: 'pending')
- `acceptedDate` (String, optional)
- `acceptedTime` (String, optional)
- `meetLink` (String, optional)
- `adminMessage` (String, optional)
- `adminNotes` (String, optional)
- `userId` (String, optional, foreign key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Visitor
- `id` (String, primary key)
- `visitorId` (String, unique)
- `email` (String, optional)
- `name` (String, optional)
- `country` (String, optional)
- `browser` (String, optional)
- `device` (String, optional)
- `os` (String, optional)
- `visitorIp` (String, optional)
- `visitCount` (Int, default: 1)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens should be included in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types
- **Access Token**: Short-lived token (default: 24 hours) for API access
- **Refresh Token**: Long-lived token (default: 7 days) for obtaining new access tokens

### Role-Based Access Control
- **User**: Can access own data and submit forms
- **Admin**: Can access all data and perform administrative actions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | SQLite database URL | file:./dev.db |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3000 |

## Testing

Run tests with:
```bash
npm run test
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure SQLite database file exists and is writable
2. **JWT errors**: Verify JWT_SECRET is set in environment variables
3. **CORS errors**: Check CORS_ORIGIN matches frontend URL
4. **TypeScript compilation errors**: Run `npm run build` to see detailed errors

### Logs

Check server logs for detailed error information. In development mode, errors include stack traces.

## License

MIT