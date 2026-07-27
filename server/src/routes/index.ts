import { Express } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/authMiddleware';

// Helper function to parse browser from user agent (copied from controllers)
function parseBrowser(userAgent: string): string {
  if (/Edg\//.test(userAgent)) return 'Edge';
  if (/OPR\//.test(userAgent)) return 'Opera';
  if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) return 'Chrome';
  if (/Firefox\//.test(userAgent)) return 'Firefox';
  if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
  return 'Unknown';
}

export function setupRoutes(app: Express) {
  // Simple handlers for now - in a real app these would use proper controllers

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'Email and password are required'
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'Invalid email format'
        });
      }
      
      // Additional email validation - check for common disposable email domains
      const disposableDomains = [
        'tempmail.com', 'throwaway.com', 'fake.com', 'example.com', 
        'test.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com'
      ];
      
      const emailDomain = email.split('@')[1].toLowerCase();
      if (disposableDomains.some(domain => emailDomain.includes(domain))) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'Disposable email addresses are not allowed'
        });
      }
      
      // Validate password strength (minimum 8 characters, at least 1 letter and 1 number)
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'Password must be at least 8 characters long and contain at least 1 letter and 1 number'
        });
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          error: 'User already exists',
          message: 'A user with this email already exists'
        });
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Create user in database
      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: name || '',
          role: 'user' // Default role
        }
      });
      
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
      
      // Create user payload for JWT
      const userPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      };
      
      // Generate JWT tokens
      const accessToken = jwt.sign(userPayload, jwtSecret, { expiresIn: jwtExpiresIn as any });
      const refreshToken = jwt.sign(userPayload, jwtSecret, { expiresIn: '7d' as any });
      
      res.status(201).json({ 
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        tokens: { accessToken, refreshToken }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'Email and password are required'
        });
      }
      
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'Invalid email format'
        });
      }
      
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        console.log(`Login failed: User not found for email ${email}`);
        return res.status(401).json({ 
          error: 'Authentication failed',
          message: 'Invalid email or password'
        });
      }
      
      // Verify password
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!passwordValid) {
        console.log(`Login failed: Invalid password for email ${email}`);
        return res.status(401).json({ 
          error: 'Authentication failed',
          message: 'Invalid email or password'
        });
      }
      
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
      
      // Create user payload
      const userPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };
      
      // Generate JWT tokens
      const accessToken = jwt.sign(userPayload, jwtSecret, { expiresIn: jwtExpiresIn as any });
      const refreshToken = jwt.sign(userPayload, jwtSecret, { expiresIn: '7d' as any });
      
      res.json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        tokens: { accessToken, refreshToken }
      });
    } catch (error) {
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
        payload = jwt.verify(refreshToken, jwtSecret) as any;
      } catch (error) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      
      // Create new tokens with same payload
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
      const newAccessToken = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn as any });
      const newRefreshToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' as any });
      
      return res.json({ 
        message: 'Token refresh successful',
        tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(500).json({ 
        error: 'Token refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.get('/api/auth/me', authMiddleware(), async (req, res) => {
    try {
      const userPayload = (req as any).user;
      
      if (!userPayload?.userId) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userPayload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          message: 'User account no longer exists'
        });
      }
      
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.createdAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ 
        error: 'Failed to get user profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.put('/api/auth/profile', authMiddleware(), (req, res) => {
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
    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to save contact message to database',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.get('/api/contact', async (_req, res) => {
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
          created_at: m.createdAt.toISOString(),
          visitor_ip: m.visitorIp,
          browser: m.browser,
          country: m.country
        })),
        pagination: { page: 1, limit: 20, total: messages.length, totalPages: Math.ceil(messages.length / 20) }
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ 
        error: 'Failed to fetch contact messages',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Contact message update (mark as read, archive, etc.)
  app.put('/api/contact/:id', authMiddleware(), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ['new', 'read', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const updatedMessage = await prisma.contactMessage.update({
        where: { id },
        data: { status }
      });
      
      res.json({ 
        success: true,
        message: 'Contact message updated successfully',
        contactMessage: updatedMessage
      });
    } catch (error) {
      console.error('Error updating contact message:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Contact message not found',
          message: `No contact message found with ID: ${req.params.id}`
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update contact message',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Contact message delete
  app.delete('/api/contact/:id', authMiddleware(), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deletedMessage = await prisma.contactMessage.delete({
        where: { id }
      });
      
      res.json({ 
        success: true,
        message: 'Contact message deleted successfully',
        contactMessage: deletedMessage
      });
    } catch (error) {
      console.error('Error deleting contact message:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Contact message not found',
          message: `No contact message found with ID: ${req.params.id}`
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to delete contact message',
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
      const forwardedFor = req.headers['x-forwarded-for'];
      let clientIp = 'unknown';
      if (forwardedFor) {
        clientIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0].trim();
      } else if (req.ip) {
        clientIp = req.ip;
      }
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
    } catch (error) {
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
  
  app.get('/api/meeting', async (_req, res) => {
    try {
      // Fetch real meeting requests from database
      const meetings = await prisma.meetingRequest.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({ 
        meetings: meetings.map(m => ({
          id: m.id,
          customer_name: m.customerName,
          email: m.email,
          meeting_topic: m.meetingTopic,
          status: m.status,
          requested_date: m.requestedDate,
          requested_time: m.requestedTime,
          company: m.company,
          notes: m.notes,
          created_at: m.createdAt.toISOString()
        })),
        pagination: { page: 1, limit: 20, total: meetings.length, totalPages: Math.ceil(meetings.length / 20) }
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      res.status(500).json({ 
        error: 'Failed to fetch meeting requests',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Meeting request update (accept/reject/complete, update admin notes)
  app.put('/api/meeting/:id', authMiddleware(), async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        status, 
        acceptedDate, 
        acceptedTime, 
        meetLink, 
        adminMessage, 
        adminNotes 
      } = req.body;
      
      // Validate status if provided
      const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const updateData: any = {};
      if (status) updateData.status = status;
      if (acceptedDate !== undefined) updateData.acceptedDate = acceptedDate;
      if (acceptedTime !== undefined) updateData.acceptedTime = acceptedTime;
      if (meetLink !== undefined) updateData.meetLink = meetLink;
      if (adminMessage !== undefined) updateData.adminMessage = adminMessage;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      
      const updatedMeeting = await prisma.meetingRequest.update({
        where: { id },
        data: updateData
      });
      
      res.json({ 
        success: true,
        message: 'Meeting request updated successfully',
        meeting: {
          id: updatedMeeting.id,
          customer_name: updatedMeeting.customerName,
          email: updatedMeeting.email,
          meeting_topic: updatedMeeting.meetingTopic,
          status: updatedMeeting.status,
          requested_date: updatedMeeting.requestedDate,
          requested_time: updatedMeeting.requestedTime,
          company: updatedMeeting.company,
          notes: updatedMeeting.notes,
          accepted_date: updatedMeeting.acceptedDate,
          accepted_time: updatedMeeting.acceptedTime,
          meet_link: updatedMeeting.meetLink,
          admin_message: updatedMeeting.adminMessage,
          admin_notes: updatedMeeting.adminNotes,
          created_at: updatedMeeting.createdAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating meeting request:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Meeting request not found',
          message: `No meeting request found with ID: ${req.params.id}`
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update meeting request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Meeting request respond endpoint (accept/reject with email response)
  app.post('/api/meeting/:id/respond', authMiddleware(), async (req, res) => {
    try {
      const { id } = req.params;
      const { action, acceptedDate, acceptedTime, meetLink, adminMessage } = req.body;
      
      if (!['accepted', 'rejected'].includes(action)) {
        return res.status(400).json({ 
          error: 'Invalid action',
          message: 'Action must be either "accepted" or "rejected"'
        });
      }
      
      const updateData: any = {
        status: action
      };
      
      if (action === 'accepted') {
        if (!acceptedDate || !acceptedTime) {
          return res.status(400).json({ 
            error: 'Missing required fields',
            message: 'Accepted date and time are required when accepting a meeting'
          });
        }
        updateData.acceptedDate = acceptedDate;
        updateData.acceptedTime = acceptedTime;
        if (meetLink) updateData.meetLink = meetLink;
        if (adminMessage) updateData.adminMessage = adminMessage;
      }
      
      const updatedMeeting = await prisma.meetingRequest.update({
        where: { id },
        data: updateData
      });
      
      // Generate email content
      const emailBody = action === 'accepted' 
        ? `Dear ${updatedMeeting.customerName},\n\nThank you for your meeting request about "${updatedMeeting.meetingTopic}".\n\nYour meeting has been accepted and scheduled for:\nDate: ${acceptedDate}\nTime: ${acceptedTime}\n\n${meetLink ? `Meeting Link: ${meetLink}\n\n` : ''}${adminMessage ? `Additional Notes: ${adminMessage}\n\n` : ''}Please let us know if you need to reschedule.\n\nBest regards,\nYour Team`
        : `Dear ${updatedMeeting.customerName},\n\nThank you for your meeting request about "${updatedMeeting.meetingTopic}".\n\nUnfortunately, we are unable to schedule this meeting at the requested time due to prior commitments. We apologize for any inconvenience.\n\nPlease feel free to submit another request with alternative dates/times, or contact us directly for other inquiries.\n\nBest regards,\nYour Team`;
      
      res.json({ 
        success: true,
        message: `Meeting ${action} successfully`,
        emailSent: false, // No actual email sent from backend
        emailBody: emailBody,
        emailSubject: action === 'accepted' 
          ? `Meeting Accepted: ${updatedMeeting.meetingTopic}` 
          : `Meeting Rescheduling Request: ${updatedMeeting.meetingTopic}`,
        meeting: {
          id: updatedMeeting.id,
          status: updatedMeeting.status,
          ...(action === 'accepted' ? {
            accepted_date: updatedMeeting.acceptedDate,
            accepted_time: updatedMeeting.acceptedTime,
            meet_link: updatedMeeting.meetLink,
            admin_message: updatedMeeting.adminMessage
          } : {})
        }
      });
    } catch (error) {
      console.error('Error responding to meeting request:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Meeting request not found',
          message: `No meeting request found with ID: ${req.params.id}`
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to respond to meeting request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Meeting request delete
  app.delete('/api/meeting/:id', authMiddleware(), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deletedMeeting = await prisma.meetingRequest.delete({
        where: { id }
      });
      
      res.json({ 
        success: true,
        message: 'Meeting request deleted successfully',
        meeting: deletedMeeting
      });
    } catch (error) {
      console.error('Error deleting meeting request:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Meeting request not found',
          message: `No meeting request found with ID: ${req.params.id}`
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to delete meeting request',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Availability routes
  app.post('/api/availability', async (req, res) => {
    try {
      const { date } = req.body;
      console.log('Availability check for date:', date);
      
      // Get booked meetings for this date
      const bookedMeetings = await prisma.meetingRequest.findMany({
        where: {
          requestedDate: date,
          status: {
            in: ['pending', 'accepted']
          }
        }
      });
      
      const bookedSlots = bookedMeetings.map(meeting => meeting.requestedTime);
      
      // Define all available time slots
      const availableSlots = [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
      ];
      
      // Filter out booked slots
      const freeSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));
      
      res.json({ 
        date,
        booked_slots: bookedSlots,
        available_slots: freeSlots,
        total_booked: bookedSlots.length,
        total_available: freeSlots.length
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ 
        error: 'Availability check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.get('/api/availability/weekly', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      console.log('Weekly availability check from:', startDate, 'to', endDate);
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          error: 'Missing parameters',
          message: 'startDate and endDate are required'
        });
      }
      
      // Get booked meetings for this date range
      const bookedMeetings = await prisma.meetingRequest.findMany({
        where: {
          requestedDate: {
            gte: startDate as string,
            lte: endDate as string
          },
          status: {
            in: ['pending', 'accepted']
          }
        }
      });
      
      // Group booked slots by date
      const availabilityByDate: Record<string, string[]> = {};
      bookedMeetings.forEach(meeting => {
        if (!availabilityByDate[meeting.requestedDate]) {
          availabilityByDate[meeting.requestedDate] = [];
        }
        availabilityByDate[meeting.requestedDate].push(meeting.requestedTime);
      });
      
      res.json({ 
        startDate,
        endDate,
        availability: availabilityByDate,
        summary: { 
          totalDays: Object.keys(availabilityByDate).length, 
          totalBookedSlots: bookedMeetings.length,
          averageDailyAvailability: bookedMeetings.length / Math.max(1, Object.keys(availabilityByDate).length)
        }
      });
    } catch (error) {
      console.error('Error checking weekly availability:', error);
      res.status(500).json({ 
        error: 'Weekly availability check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
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

  // Update visitor (including admin notes)
  app.put('/api/visit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { admin_notes, adminNotes } = req.body;
      
      // Accept either snake_case or camelCase
      const notesValue = admin_notes || adminNotes;
      
      if (!notesValue && notesValue !== '') {
        return res.status(400).json({ 
          error: 'Validation error',
          message: 'admin_notes field is required'
        });
      }
      
      const updatedVisitor = await prisma.visitor.update({
        where: { id },
        data: { adminNotes: notesValue }
      });
      
      res.json({ 
        success: true,
        message: 'Visitor updated successfully',
        visitor: {
          id: updatedVisitor.id,
          visitor_id: updatedVisitor.visitorId,
          email: updatedVisitor.email,
          name: updatedVisitor.name,
          country: updatedVisitor.country,
          browser: updatedVisitor.browser,
          device: updatedVisitor.device,
          os: updatedVisitor.os,
          visitor_ip: updatedVisitor.visitorIp,
          visit_count: updatedVisitor.visitCount,
          admin_notes: updatedVisitor.adminNotes,
          created_date: updatedVisitor.createdAt,
          updated_date: updatedVisitor.updatedAt
        }
      });
      
    } catch (error) {
      console.error('Error updating visitor:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Not found',
          message: 'Visitor not found'
        });
      }
      
      res.status(500).json({ 
        error: 'Update failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
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
        const decoded = jwt.verify(token, jwtSecret) as any;
        userRole = decoded.role || 'user';
      } catch (error) {
        // Token invalid, but we still allow access for testing
        console.debug('Invalid token for admin data:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    console.log(`Admin data requested by role: ${userRole}`);
    
    try {
      // Fetch REAL data from database
      const [visitors, meetings, messages, visitorStats, uniqueCountriesResult, meetingStats, messageStats] = await Promise.all([
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
        
        // Get visitor statistics - count total visitors
        prisma.visitor.aggregate({
          _count: { id: true },
        }),
        
        // Get unique countries count
        prisma.visitor.findMany({
          select: { country: true },
          distinct: ['country']
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
      const uniqueCountries = uniqueCountriesResult.length;
      
      const meetingStatusCounts = meetingStats.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>);
      
      const totalMeetings = Object.values(meetingStatusCounts).reduce((sum, count) => sum + count, 0);
      
      const messageStatusCounts = messageStats.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>);
      
      const totalMessages = Object.values(messageStatusCounts).reduce((sum, count) => sum + count, 0);
      
      // Calculate upcoming meetings (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingMeetings = meetings.filter(meeting => {
        try {
          const meetingDate = new Date(meeting.requestedDate);
          return meetingDate >= today && meetingDate <= nextWeek && meeting.status === 'accepted';
        } catch {
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
      }, {} as Record<string, number>);
      
      const totalUsers = Object.values(userRoleCounts).reduce((sum, count) => sum + count, 0);
      
      // Prepare response data
      const responseData = {
        visitors: visitors.map(v => ({
          id: v.id,
          visitor_id: v.visitorId,
          country: v.country || 'Unknown',
          browser: v.browser || 'Unknown',
          visit_count: v.visitCount,
          os: v.os || 'Unknown',
          device: v.device || 'Unknown',
          last_visit: v.updatedAt.toISOString(),
          updated_date: v.updatedAt.toISOString(),
          email: v.email || '',
          name: v.name || '',
          visitor_ip: v.visitorIp || '',
          created_at: v.createdAt.toISOString(),
          created_date: v.createdAt.toISOString()
        })),
        meetings: meetings.map(m => ({
          id: m.id,
          customer_name: m.customerName,
          email: m.email,
          company: m.company || '',
          status: m.status,
          requested_date: m.requestedDate,
          requested_time: m.requestedTime,
          meeting_topic: m.meetingTopic,
          notes: m.notes || '',
          visitor_ip: m.visitorIp || '',
          browser: m.browser || '',
          country: m.country || '',
          created_at: m.createdAt.toISOString(),
          updated_at: m.updatedAt.toISOString(),
          accepted_date: m.acceptedDate,
          accepted_time: m.acceptedTime,
          meet_link: m.meetLink,
          admin_message: m.adminMessage,
          admin_notes: m.adminNotes
        })),
        messages: messages.map(m => ({
          id: m.id,
          fullName: m.fullName,
          email: m.email,
          status: m.status,
          message: m.message,
          visitor_ip: m.visitorIp || '',
          browser: m.browser || '',
          country: m.country || '',
          created_at: m.createdAt.toISOString(),
          updated_at: m.updatedAt.toISOString()
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
      
    } catch (error) {
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
      
      fileStream.on('error', (error: any) => {
        console.error('Error streaming resume file:', error);
        return res.status(500).json({ 
          error: 'Failed to download resume',
          message: error.message 
        });
      });
    } catch (error: any) {
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
  app.get('/api/auth/isAuthenticated', authMiddleware(), (_req, res) => {
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