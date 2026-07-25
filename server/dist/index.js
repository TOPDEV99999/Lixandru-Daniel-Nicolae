"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Configure CORS to allow frontend requests
const corsOptions = {
    origin: ['https://6a64b8508364133eb772eb59--lixandru-daniel-nicolae.netlify.app', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
// console.log("323232");
// Middleware
app.use((0, cors_1.default)(corsOptions));
// app.use(cors());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
(0, routes_1.setupRoutes)(app);
// Error handling middleware
app.use((err, _req, res, _next) => {
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
//# sourceMappingURL=index.js.map