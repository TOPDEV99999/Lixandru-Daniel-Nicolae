"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const authMiddleware_1 = require("../middleware/authMiddleware");
const emailService_1 = require("../services/emailService");
function setupRoutes(app) {
    // Simple handlers for now - in a real app these would use proper controllers
    // Auth routes
    app.post('/api/auth/register', (req, res) => {
        res.status(201).json({
            message: 'Registration endpoint - would create user',
            user: { id: 'temp-id', email: req.body.email },
            tokens: { accessToken: 'temp-token', refreshToken: 'temp-refresh' }
        });
    });
    app.post('/api/auth/login', (req, res) => {
        res.json({
            message: 'Login endpoint - would authenticate',
            user: { id: 'temp-id', email: req.body.email, role: 'user' },
            tokens: { accessToken: 'temp-token', refreshToken: 'temp-refresh' }
        });
    });
    app.post('/api/auth/refresh', (_req, res) => {
        res.json({
            message: 'Token refresh endpoint',
            tokens: { accessToken: 'new-token', refreshToken: 'new-refresh' }
        });
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
            // Send email notification
            const emailResult = await emailService_1.emailService.sendContactMessageNotification({
                fullName: req.body.full_name || req.body.fullName || 'Unknown',
                email: req.body.email || 'unknown@example.com',
                message: req.body.message || '',
                visitorIp: Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || req.ip,
                browser: req.headers['user-agent'] || 'Unknown',
                country: Array.isArray(req.headers['cf-ipcountry']) ? req.headers['cf-ipcountry'][0] : req.headers['cf-ipcountry'] || 'Unknown'
            });
            res.status(201).json({
                success: true,
                message: 'Contact message submitted successfully',
                id: 'contact-' + Date.now(),
                emailSent: emailResult.success,
                emailMessage: emailResult.message
            });
        }
        catch (error) {
            console.error('Contact submission error:', error);
            res.status(201).json({
                success: true,
                message: 'Contact message submitted (email notification failed)',
                id: 'contact-' + Date.now(),
                emailSent: false,
                emailMessage: 'Failed to send email notification'
            });
        }
    });
    app.get('/api/contact', (0, authMiddleware_1.authMiddleware)('admin'), (_req, res) => {
        res.json({
            messages: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        });
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
            // Send email notification
            const emailResult = await emailService_1.emailService.sendMeetingRequestNotification({
                ...meetingData,
                visitorIp: Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || req.ip,
                browser: req.headers['user-agent'] || 'Unknown',
                country: Array.isArray(req.headers['cf-ipcountry']) ? req.headers['cf-ipcountry'][0] : req.headers['cf-ipcountry'] || 'Unknown'
            });
            res.status(201).json({
                success: true,
                message: 'Meeting request submitted successfully',
                id: 'meeting-' + Date.now(),
                emailSent: emailResult.success,
                emailMessage: emailResult.message,
                meeting: {
                    id: 'meeting-' + Date.now(),
                    ...meetingData,
                    status: 'pending'
                }
            });
        }
        catch (error) {
            console.error('Meeting submission error:', error);
            res.status(201).json({
                success: true,
                message: 'Meeting request submitted (email notification failed)',
                id: 'meeting-' + Date.now(),
                emailSent: false,
                emailMessage: 'Failed to send email notification',
                meeting: {
                    id: 'meeting-' + Date.now(),
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
    app.get('/api/meeting', (0, authMiddleware_1.authMiddleware)(), (_req, res) => {
        res.json({
            meetings: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        });
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
    // Admin routes
    app.get('/api/admin/data', (0, authMiddleware_1.authMiddleware)('admin'), (_req, res) => {
        res.json({
            statistics: {
                visitors: { total: 0, uniqueCountries: 0 },
                meetings: { total: 0, byStatus: {}, upcoming: 0 },
                messages: { total: 0, byStatus: {}, unread: 0 },
                users: { total: 0, byRole: {} },
                overview: { totalRecords: 0, growthRate: 0 }
            },
            recentData: { visitors: [], meetings: [], messages: [] },
            summary: { totalVisitors: 0, totalMeetings: 0, totalMessages: 0, totalUsers: 0 }
        });
    });
    // Email test endpoint (admin only)
    app.post('/api/admin/test-email', (0, authMiddleware_1.authMiddleware)('admin'), async (_req, res) => {
        try {
            const result = await emailService_1.emailService.sendTestEmail();
            res.json({
                success: true,
                message: 'Test email sent',
                result
            });
        }
        catch (error) {
            console.error('Test email error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: error.message
            });
        }
    });
    // Email configuration check endpoint
    app.get('/api/admin/email-config', (_req, res) => {
        const config = {
            EMAIL_USER: process.env.EMAIL_USER ? 'Set (hidden)' : 'Not set',
            EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set',
            EMAIL_FROM: process.env.EMAIL_FROM || 'Not set',
            EMAIL_ENABLED: process.env.EMAIL_ENABLED || 'false',
            NODE_ENV: process.env.NODE_ENV || 'development'
        };
        res.json({
            success: true,
            config,
            instructions: 'To enable email: 1) Enable 2-Step Verification on Google, 2) Generate App Password, 3) Update .env file'
        });
    });
    // View saved email logs
    app.get('/api/admin/email-logs', (0, authMiddleware_1.authMiddleware)('admin'), (_req, res) => {
        try {
            const fs = require('fs');
            const path = require('path');
            const emailDir = path.join(__dirname, '../email_logs');
            if (!fs.existsSync(emailDir)) {
                return res.json({
                    success: true,
                    emails: [],
                    message: 'No email logs directory found'
                });
            }
            const files = fs.readdirSync(emailDir)
                .filter((file) => file.endsWith('.txt'))
                .map((file) => {
                const filepath = path.join(emailDir, file);
                const content = fs.readFileSync(filepath, 'utf8');
                const dateMatch = content.match(/Date: (.+)/);
                const toMatch = content.match(/To: (.+)/);
                const subjectMatch = content.match(/Subject: (.+)/);
                return {
                    filename: file,
                    date: dateMatch ? dateMatch[1] : 'Unknown',
                    to: toMatch ? toMatch[1] : 'Unknown',
                    subject: subjectMatch ? subjectMatch[1] : 'No subject',
                    preview: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
                    fullContent: content
                };
            })
                .sort((a, b) => b.date.localeCompare(a.date)); // Newest first
            return res.json({
                success: true,
                emails: files,
                count: files.length,
                directory: emailDir
            });
        }
        catch (error) {
            console.error('Error reading email logs:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to read email logs',
                error: error.message
            });
        }
    });
    // View specific email log
    app.get('/api/admin/email-logs/:filename', (0, authMiddleware_1.authMiddleware)('admin'), (req, res) => {
        try {
            const { filename } = req.params;
            const fs = require('fs');
            const path = require('path');
            const emailDir = path.join(__dirname, '../email_logs');
            const filepath = path.join(emailDir, filename);
            if (!fs.existsSync(filepath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Email log not found'
                });
            }
            const content = fs.readFileSync(filepath, 'utf8');
            return res.json({
                success: true,
                filename,
                content,
                size: content.length
            });
        }
        catch (error) {
            console.error('Error reading email log:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to read email log',
                error: error.message
            });
        }
    });
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