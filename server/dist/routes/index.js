"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../generated/prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma = new prisma_1.PrismaClient();
// Helper function to parse browser from user agent (copied from controllers)
function parseBrowser(userAgent) {
    if (/Edg\//.test(userAgent))
        return 'Edge';
    if (/OPR\//.test(userAgent))
        return 'Opera';
    if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent))
        return 'Chrome';
    if (/Firefox\//.test(userAgent))
        return 'Firefox';
    if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent))
        return 'Safari';
    return 'Unknown';
}
function setupRoutes(app) {
    // Simple handlers for now - in a real app these would use proper controllers
    // Auth routes
    app.post('/api/auth/register', (req, res) => {
        try {
            const { email } = req.body;
            const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
            // Create user payload
            const userPayload = {
                userId: 'new-user-id-' + Date.now(),
                email: email || 'newuser@example.com',
                role: 'user'
            };
            // Generate real JWT tokens
            const accessToken = jsonwebtoken_1.default.sign(userPayload, jwtSecret, { expiresIn: jwtExpiresIn });
            const refreshToken = jsonwebtoken_1.default.sign(userPayload, jwtSecret, { expiresIn: '7d' });
            res.status(201).json({
                message: 'Registration successful',
                user: userPayload,
                tokens: { accessToken, refreshToken }
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                error: 'Registration failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    app.post('/api/auth/login', (req, res) => {
        try {
            const { email, password } = req.body;
            // For demo purposes, accept any email/password
            // In production, you would validate against a database
            const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
            // Create user payload
            const userPayload = {
                userId: 'demo-user-id',
                email: email || 'demo@example.com',
                role: 'admin' // Set to admin for testing dashboard access
            };
            // Generate real JWT tokens
            const accessToken = jsonwebtoken_1.default.sign(userPayload, jwtSecret, { expiresIn: jwtExpiresIn });
            const refreshToken = jsonwebtoken_1.default.sign(userPayload, jwtSecret, { expiresIn: '7d' });
            res.json({
                message: 'Login successful',
                user: userPayload,
                tokens: { accessToken, refreshToken }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    app.post('/api/auth/refresh', (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required' });
            }
            const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
            // Verify the refresh token
            let payload;
            try {
                payload = jsonwebtoken_1.default.verify(refreshToken, jwtSecret);
            }
            catch (error) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }
            // Create new tokens with same payload
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
            const newAccessToken = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
            const newRefreshToken = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: '7d' });
            res.json({
                message: 'Token refresh successful',
                tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken }
            });
        }
        catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({
                error: 'Token refresh failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    app.get('/api/auth/me', (0, authMiddleware_1.authMiddleware)(), (req, res) => {
        res.json({
            user: req.user || { id: 'temp-id', email: 'test@example.com', role: 'user' }
        });
    });
    app.put('/api/auth/profile', (0, authMiddleware_1.authMiddleware)(), (req, res) => {
        res.json({
            message: 'Profile updated',
            user: { id: 'temp-id', email: req.body.email || 'test@example.com' }
        });
    });
    // Contact routes
    app.post('/api/contact', async (req, res) => {
        console.log('Contact form submission:', req.body);
        try {
            // Extract data from request
            const { full_name, fullName, email, message, visitorIp, browser, country } = req.body;
            // Use either field name (full_name from frontend, fullName from backend)
            const nameValue = full_name || fullName || '';
            // Get visitor information from headers
            const clientIp = visitorIp || req.headers['x-forwarded-for'] || req.ip || 'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';
            const detectedBrowser = browser || parseBrowser(userAgent);
            const detectedCountry = country || req.headers['cf-ipcountry'] || 'unknown';
            // Save to database
            const contactMessage = await prisma.contactMessage.create({
                data: {
                    fullName: nameValue,
                    email: email,
                    message: message,
                    visitorIp: clientIp,
                    browser: detectedBrowser,
                    country: Array.isArray(detectedCountry) ? detectedCountry[0] : detectedCountry,
                    status: 'new'
                }
            });
            console.log('Contact message saved to database:', contactMessage.id);
            res.status(201).json({
                success: true,
                message: 'Contact message submitted successfully',
                id: contactMessage.id,
                emailSent: false, // No email sent from backend
                emailMessage: 'Email sending handled via FormSubmit from frontend'
            });
        }
        catch (error) {
            console.error('Contact submission error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to save contact message to database',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    app.get('/api/contact', async (req, res) => {
        try {
            // Fetch real contact messages from database
            const messages = await prisma.contactMessage.findMany({
                take: 50,
                orderBy: { createdAt: 'desc' }
            });
            res.json({
                messages: messages.map(m => ({
                    id: m.id,
                    fullName: m.fullName,
                    email: m.email,
                    message: m.message,
                    status: m.status,
                    createdAt: m.createdAt.toISOString(),
                    visitorIp: m.visitorIp,
                    browser: m.browser,
                    country: m.country
                })),
                pagination: { page: 1, limit: 20, total: messages.length, totalPages: Math.ceil(messages.length / 20) }
            });
        }
        catch (error) {
            console.error('Error fetching contact messages:', error);
            res.status(500).json({
                error: 'Failed to fetch contact messages',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    // Meeting routes
    app.post('/api/meeting', async (req, res) => {
        console.log('Meeting request:', req.body);
        try {
            // Handle both frontend and backend field names
            const meetingData = {
                customerName: req.body.customer_name || req.body.customerName || 'Unknown',
                email: req.body.email || 'unknown@example.com',
                company: req.body.company || '',
                meetingTopic: req.body.meeting_topic || req.body.meetingTopic || req.body.topic || 'General Discussion',
                requestedDate: req.body.requested_date || req.body.requestedDate || new Date().toISOString().split('T')[0],
                requestedTime: req.body.requested_time || req.body.requestedTime || '12:00',
                notes: req.body.notes || ''
            };
            // Get visitor information
            const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';
            const detectedBrowser = parseBrowser(userAgent);
            const detectedCountry = req.headers['cf-ipcountry'] || 'unknown';
            // Save to database
            const meetingRequest = await prisma.meetingRequest.create({
                data: {
                    customerName: meetingData.customerName,
                    email: meetingData.email,
                    company: meetingData.company,
                    meetingTopic: meetingData.meetingTopic,
                    requestedDate: meetingData.requestedDate,
                    requestedTime: meetingData.requestedTime,
                    notes: meetingData.notes,
                    visitorIp: clientIp,
                    browser: detectedBrowser,
                    country: Array.isArray(detectedCountry) ? detectedCountry[0] : detectedCountry,
                    status: 'pending'
                }
            });
            console.log('Meeting request saved to database:', meetingRequest.id);
            res.status(201).json({
                success: true,
                message: 'Meeting request submitted successfully',
                id: meetingRequest.id,
                emailSent: false, // No email sent from backend
                emailMessage: 'Email sending handled via FormSubmit from frontend',
                meeting: {
                    id: meetingRequest.id,
                    ...meetingData,
                    status: 'pending'
                }
            });
        }
        catch (error) {
            console.error('Meeting submission error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to save meeting request to database',
                error: error instanceof Error ? error.message : 'Unknown error',
                meeting: {
                    id: 'error-' + Date.now(),
                    customerName: req.body.customer_name || req.body.customerName || 'Unknown',
                    email: req.body.email || 'unknown@example.com',
                    meetingTopic: req.body.meeting_topic || req.body.meetingTopic || req.body.topic || 'General Discussion',
                    requestedDate: req.body.requested_date || req.body.requestedDate || new Date().toISOString().split('T')[0],
                    requestedTime: req.body.requested_time || req.body.requestedTime || '12:00',
                    status: 'pending'
                }
            });
        }
    });
    app.get('/api/meeting', async (req, res) => {
        try {
            // Fetch real meeting requests from database
            const meetings = await prisma.meetingRequest.findMany({
                take: 50,
                orderBy: { createdAt: 'desc' }
            });
            res.json({
                meetings: meetings.map(m => ({
                    id: m.id,
                    customerName: m.customerName,
                    email: m.email,
                    meetingTopic: m.meetingTopic,
                    status: m.status,
                    requestedDate: m.requestedDate,
                    requestedTime: m.requestedTime,
                    company: m.company,
                    notes: m.notes,
                    createdAt: m.createdAt.toISOString()
                })),
                pagination: { page: 1, limit: 20, total: meetings.length, totalPages: Math.ceil(meetings.length / 20) }
            });
        }
        catch (error) {
            console.error('Error fetching meetings:', error);
            res.status(500).json({
                error: 'Failed to fetch meeting requests',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    // Availability routes
    app.post('/api/availability', (req, res) => {
        const { date } = req.body;
        console.log('Availability check for date:', date);
        res.json({
            date,
            bookedSlots: ['09:00', '10:30', '14:00'],
            availableSlots: ['09:30', '10:00', '11:00', '11:30', '13:00', '13:30', '15:00', '15:30', '16:00'],
            totalBooked: 3,
            totalAvailable: 9
        });
    });
    app.get('/api/availability/weekly', (req, res) => {
        const { startDate, endDate } = req.query;
        res.json({
            startDate,
            endDate,
            availability: {},
            summary: { totalDays: 0, totalBookedSlots: 0, averageDailyAvailability: 0 }
        });
    });
    // Visitor routes
    app.post('/api/visit', (_req, res) => {
        console.log('Visitor tracked');
        res.status(201).json({
            success: true,
            message: 'Visitor tracked',
            visitor: { id: 'visitor-' + Date.now(), visitorId: 'temp-visitor', visitCount: 1 }
        });
    });
    // Admin routes - temporarily allow access without auth for testing
    app.get('/api/admin/data', async (req, res) => {
        // For testing, allow access without auth
        // In production, use: authMiddleware('admin')
        // Check for token but don't require it
        const authHeader = req.headers.authorization;
        let userRole = 'guest';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
                const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                userRole = decoded.role || 'user';
            }
            catch (error) {
                // Token invalid, but we still allow access for testing
                console.debug('Invalid token for admin data:', error.message);
            }
        }
        console.log(`Admin data requested by role: ${userRole}`);
        try {
            // Fetch REAL data from database
            const [visitors, meetings, messages, visitorStats, meetingStats, messageStats] = await Promise.all([
                // Get visitors (limit to 50 for performance)
                prisma.visitor.findMany({
                    take: 50,
                    orderBy: { createdAt: 'desc' }
                }),
                // Get meetings (limit to 50 for performance)
                prisma.meetingRequest.findMany({
                    take: 50,
                    orderBy: { createdAt: 'desc' }
                }),
                // Get contact messages (limit to 50 for performance)
                prisma.contactMessage.findMany({
                    take: 50,
                    orderBy: { createdAt: 'desc' }
                }),
                // Get visitor statistics
                prisma.visitor.aggregate({
                    _count: { id: true },
                    _countDistinct: { country: true }
                }),
                // Get meeting statistics
                prisma.meetingRequest.groupBy({
                    by: ['status'],
                    _count: { id: true }
                }),
                // Get message statistics
                prisma.contactMessage.groupBy({
                    by: ['status'],
                    _count: { id: true }
                })
            ]);
            // Calculate statistics
            const totalVisitors = visitorStats._count.id;
            const uniqueCountries = visitorStats._countDistinct.country;
            const meetingStatusCounts = meetingStats.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {});
            const totalMeetings = Object.values(meetingStatusCounts).reduce((sum, count) => sum + count, 0);
            const messageStatusCounts = messageStats.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {});
            const totalMessages = Object.values(messageStatusCounts).reduce((sum, count) => sum + count, 0);
            // Calculate upcoming meetings (next 7 days)
            const today = new Date();
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const upcomingMeetings = meetings.filter(meeting => {
                try {
                    const meetingDate = new Date(meeting.requestedDate);
                    return meetingDate >= today && meetingDate <= nextWeek && meeting.status === 'accepted';
                }
                catch {
                    return false;
                }
            }).length;
            // Calculate unread messages
            const unreadMessages = messageStatusCounts['new'] || 0;
            // Get user statistics
            const userStats = await prisma.user.groupBy({
                by: ['role'],
                _count: { id: true }
            });
            const userRoleCounts = userStats.reduce((acc, item) => {
                acc[item.role] = item._count.id;
                return acc;
            }, {});
            const totalUsers = Object.values(userRoleCounts).reduce((sum, count) => sum + count, 0);
            // Prepare response data
            const responseData = {
                visitors: visitors.map(v => ({
                    id: v.id,
                    visitorId: v.visitorId,
                    country: v.country || 'Unknown',
                    browser: v.browser || 'Unknown',
                    visitCount: v.visitCount,
                    os: v.os || 'Unknown',
                    device: v.device || 'Unknown',
                    lastVisit: v.updatedAt.toISOString(),
                    email: v.email || '',
                    name: v.name || '',
                    visitorIp: v.visitorIp || '',
                    createdAt: v.createdAt.toISOString()
                })),
                meetings: meetings.map(m => ({
                    id: m.id,
                    customerName: m.customerName,
                    email: m.email,
                    company: m.company || '',
                    status: m.status,
                    requestedDate: m.requestedDate,
                    requestedTime: m.requestedTime,
                    meetingTopic: m.meetingTopic,
                    notes: m.notes || '',
                    visitorIp: m.visitorIp || '',
                    browser: m.browser || '',
                    country: m.country || '',
                    createdAt: m.createdAt.toISOString(),
                    updatedAt: m.updatedAt.toISOString(),
                    acceptedDate: m.acceptedDate,
                    acceptedTime: m.acceptedTime,
                    meetLink: m.meetLink,
                    adminMessage: m.adminMessage,
                    adminNotes: m.adminNotes
                })),
                messages: messages.map(m => ({
                    id: m.id,
                    fullName: m.fullName,
                    email: m.email,
                    status: m.status,
                    message: m.message,
                    visitorIp: m.visitorIp || '',
                    browser: m.browser || '',
                    country: m.country || '',
                    createdAt: m.createdAt.toISOString(),
                    updatedAt: m.updatedAt.toISOString()
                })),
                statistics: {
                    visitors: { total: totalVisitors, uniqueCountries },
                    meetings: {
                        total: totalMeetings,
                        byStatus: meetingStatusCounts,
                        upcoming: upcomingMeetings
                    },
                    messages: {
                        total: totalMessages,
                        byStatus: messageStatusCounts,
                        unread: unreadMessages
                    },
                    users: { total: totalUsers, byRole: userRoleCounts },
                    overview: {
                        totalRecords: totalVisitors + totalMeetings + totalMessages + totalUsers,
                        growthRate: 0 // Would need historical data to calculate
                    }
                },
                summary: {
                    totalVisitors,
                    totalMeetings,
                    totalMessages,
                    totalUsers,
                    requestTime: new Date().toISOString(),
                    userRole: userRole
                }
            };
            console.log(`Returning real data: ${visitors.length} visitors, ${meetings.length} meetings, ${messages.length} messages`);
            res.json(responseData);
        }
        catch (error) {
            console.error('Error fetching admin data:', error);
            res.status(500).json({
                error: 'Failed to fetch admin data',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
    // Email functionality is handled via FormSubmit from frontend
    // Backend only handles data storage, not email sending
    // Admin email routes have been removed as per architecture requirements
    // Resume download endpoint
    app.get('/api/resume', (_req, res) => {
        const fs = require('fs');
        const path = require('path');
        console.log('Resume download requested');
        // Try to find the resume file
        const possiblePaths = [
            path.join(__dirname, '../../files/Lixandru_Daniel_Nicolae.pdf'),
            path.join(__dirname, '../files/Lixandru_Daniel_Nicolae.pdf'),
            path.join(process.cwd(), 'files/Lixandru_Daniel_Nicolae.pdf'),
            path.join(__dirname, '../../../files/Lixandru_Daniel_Nicolae.pdf')
        ];
        let foundPath = null;
        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                foundPath = filePath;
                console.log('Found resume at:', filePath);
                break;
            }
        }
        if (!foundPath) {
            console.error('Resume file not found. Searched paths:', possiblePaths);
            return res.status(404).json({
                error: 'Resume file not found',
                message: 'Resume PDF file could not be located on the server'
            });
        }
        // Get the filename for download
        const filename = 'Lixandru_Daniel_Nicolae_Resume.pdf';
        // Set headers and send file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        try {
            const fileStream = fs.createReadStream(foundPath);
            return fileStream.pipe(res);
            fileStream.on('error', (error) => {
                console.error('Error streaming resume file:', error);
                return res.status(500).json({
                    error: 'Failed to download resume',
                    message: error.message
                });
            });
        }
        catch (error) {
            console.error('Error downloading resume:', error);
            return res.status(500).json({
                error: 'Failed to download resume',
                message: error.message
            });
        }
    });
    // Function invocation compatibility routes (for Base44 function compatibility)
    app.post('/api/functions/:functionName', async (req, res) => {
        const { functionName } = req.params;
        console.log(`Base44 function invoked: ${functionName}`, req.body);
        switch (functionName) {
            case 'getAvailability':
                // Mock response for availability check
                return res.json({
                    data: {
                        booked_slots: ['09:00', '10:30', '14:00']
                    },
                    error: null,
                    success: true
                });
            case 'submitMeeting':
                // Mock response for meeting submission
                return res.json({
                    data: {
                        success: true,
                        id: 'meeting-' + Date.now(),
                        email_sent: false
                    },
                    error: null,
                    success: true
                });
            case 'submitContact':
                // Mock response for contact submission
                return res.json({
                    data: {
                        success: true,
                        id: 'contact-' + Date.now(),
                        email_sent: false
                    },
                    error: null,
                    success: true
                });
            case 'getAdminData':
                // Mock response for admin data
                return res.json({
                    data: {
                        visitors: [],
                        meetings: [],
                        messages: []
                    },
                    error: null,
                    success: true
                });
            case 'trackVisit':
                // Mock response for visitor tracking
                return res.json({
                    data: { success: true },
                    error: null,
                    success: true
                });
            default:
                return res.status(404).json({
                    error: 'Function not found',
                    message: `Function ${functionName} is not implemented`,
                    data: null,
                    success: false
                });
        }
    });
    // Base44 SDK compatibility routes
    app.get('/api/auth/isAuthenticated', (0, authMiddleware_1.authMiddleware)(), (_req, res) => {
        res.json({ authenticated: true });
    });
    // Note: /api/auth/me is already defined above, so this duplicate is removed
    app.post('/api/auth/logout', (_req, res) => {
        // Clear token on client side
        res.json({ success: true, message: 'Logged out successfully' });
    });
    // Note: General 404 handler is in src/index.ts
    // This handles unmatched routes for the entire app
}
//# sourceMappingURL=index.js.map