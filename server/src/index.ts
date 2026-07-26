import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to allow frontend requests
const corsOptions = {
  origin: ['https://lixandru-daniel-nicolae.netlify.app', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'local-backend',
    version: '1.0.0'
  });
});

// Basic route for testing
app.get('/', (_req, res) => {
  res.json({
    message: 'Local Backend APIas',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/...',
      contact: '/api/contact',
      meeting: '/api/meeting',
      availability: '/api/availability',
      visit: '/api/visit',
      admin: '/api/admin/data'
    },
    documentation: 'See server/README.md for API documentation'
  });
});

// Setup all API routes
setupRoutes(app);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${_req.method} ${_req.path}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Local backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
