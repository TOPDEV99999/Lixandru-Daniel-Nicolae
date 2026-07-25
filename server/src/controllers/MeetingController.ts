import { Request, Response } from 'express';
import { MeetingRepository, CreateMeetingRequestDto } from '../repositories/MeetingRepository';
import { meetingRequestSchema, meetingUpdateSchema, meetingResponseSchema } from '../validation/meetingValidation';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { VisitorRepository } from '../repositories/VisitorRepository';

function parseBrowser(userAgent: string): string {
  if (/Edg\//.test(userAgent)) return 'Edge';
  if (/OPR\//.test(userAgent)) return 'Opera';
  if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) return 'Chrome';
  if (/Firefox\//.test(userAgent)) return 'Firefox';
  if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
  return 'Unknown';
}

function parseOS(userAgent: string): string {
  if (/Windows NT 10/.test(userAgent)) return 'Windows';
  if (/Windows NT/.test(userAgent)) return 'Windows';
  if (/Mac OS X/.test(userAgent)) return 'macOS';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  return 'Unknown';
}

function parseDevice(userAgent: string): string {
  if (/iPad|Tablet/.test(userAgent)) return 'Tablet';
  if (/Mobile|Android|iPhone/.test(userAgent)) return 'Mobile';
  return 'Desktop';
}

function sanitize(str: string): string {
  return String(str || '').replace(/<[^>]*>/g, '').trim();
}

function getClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (Array.isArray(xForwardedFor)) {
    return xForwardedFor[0].split(',')[0].trim();
  } else if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  }
  
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (cfConnectingIp) {
    return String(cfConnectingIp);
  }
  
  return req.ip || 'unknown';
}

export class MeetingController {
  constructor(
    private meetingRepository: MeetingRepository,
    private visitorRepository: VisitorRepository
  ) {}

  async submitMeeting(req: Request, res: Response) {
    try {
      // Validate input
      const validationResult = meetingRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const { 
        customerName, email, company, meetingTopic, 
        requestedDate, requestedTime, notes, 
        visitorIp, browser, country, userId 
      } = validationResult.data;

      // Get user from optional auth middleware
      const user = (req as AuthenticatedRequest).user;

      // Get visitor information
      const clientIp = visitorIp || getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';
      const detectedBrowser = browser || parseBrowser(userAgent);
      const detectedCountry = country || req.headers['cf-ipcountry'] || 'unknown';
      const os = parseOS(userAgent);
      const device = parseDevice(userAgent);

      // Sanitize inputs
      const cleanCustomerName = sanitize(customerName);
      const cleanEmail = sanitize(email);
      const cleanCompany = sanitize(company || '');
      const cleanMeetingTopic = sanitize(meetingTopic);
      const cleanNotes = sanitize(notes || '');

      // Rate limiting check
      const recentMeetings = await this.meetingRepository.findByEmail(cleanEmail);
      const oneHourAgo = new Date(Date.now() - 3600000);
      const recentCount = recentMeetings.filter(meeting => 
        new Date(meeting.createdAt) > oneHourAgo
      ).length;

      if (recentCount >= 3) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        });
      }

      // Check for double-booking
      const existingMeetings = await this.meetingRepository.findByDateRange(requestedDate, requestedDate);
      const conflictingMeetings = existingMeetings.filter(meeting => 
        meeting.requestedTime === requestedTime && 
        ['pending', 'accepted'].includes(meeting.status)
      );

      if (conflictingMeetings.length > 0) {
        return res.status(409).json({ 
          error: 'This time slot is already booked. Please select another time.' 
        });
      }

      // Create meeting request DTO
      const createMeetingDto: CreateMeetingRequestDto = {
        customerName: cleanCustomerName,
        email: cleanEmail,
        company: cleanCompany,
        meetingTopic: cleanMeetingTopic,
        requestedDate,
        requestedTime,
        notes: cleanNotes,
        visitorIp: clientIp,
        browser: detectedBrowser,
        country: Array.isArray(detectedCountry) ? detectedCountry[0] : detectedCountry,
        userId: user?.userId || userId
      };

      // Create meeting request
      const meetingRequest = await this.meetingRepository.create(createMeetingDto);

      // Track/update visitor
      const visitorId = `${clientIp}_${os}`;
      const existingVisitor = await this.visitorRepository.findByVisitorId(visitorId);
      
      if (existingVisitor) {
        await this.visitorRepository.update(existingVisitor.id, {
          email: cleanEmail,
          name: cleanCustomerName,
          country: Array.isArray(detectedCountry) ? detectedCountry[0] : detectedCountry,
          browser: detectedBrowser,
          device,
          os,
          visitorIp: clientIp,
          visitCount: (existingVisitor.visitCount || 1) + 1
        });
      } else {
        await this.visitorRepository.create({
          visitorId,
          email: cleanEmail,
          name: cleanCustomerName,
          country: Array.isArray(detectedCountry) ? detectedCountry[0] : detectedCountry,
          browser: detectedBrowser,
          device,
          os,
          visitorIp: clientIp
        });
      }

      // TODO: Implement email notification (would need email service setup)
      const emailSent = false; // Placeholder

      return res.status(201).json({
        success: true,
        message: 'Meeting request submitted successfully',
        id: meetingRequest.id,
        emailSent,
        meeting: {
          id: meetingRequest.id,
          customerName: meetingRequest.customerName,
          email: meetingRequest.email,
          meetingTopic: meetingRequest.meetingTopic,
          requestedDate: meetingRequest.requestedDate,
          requestedTime: meetingRequest.requestedTime,
          status: meetingRequest.status,
          createdAt: meetingRequest.createdAt
        }
      });
    } catch (error: any) {
      console.error('Meeting submission error:', error);
      return res.status(500).json({ 
        error: 'Failed to submit meeting request',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getMeetingRequests(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { status, date, page = 1, limit = 20 } = req.query;
      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      let meetings;
      let total;

      if (req.user.role === 'admin') {
        // Admin can see all meetings
        if (status) {
          meetings = await this.meetingRepository.findByStatus(String(status));
          total = await this.meetingRepository.countByStatus(String(status));
        } else if (date) {
          meetings = await this.meetingRepository.findByDateRange(String(date), String(date));
          total = meetings.length;
        } else {
          meetings = await this.meetingRepository.findAll();
          total = await this.meetingRepository.count();
        }
      } else {
        // Regular users can only see their own meetings
        meetings = await this.meetingRepository.findByEmail(req.user.email);
        total = meetings.length;
      }

      // Simple pagination
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = pageNum * limitNum;
      const paginatedMeetings = meetings.slice(startIndex, endIndex);

      return res.status(200).json({
        meetings: paginatedMeetings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNext: endIndex < total,
          hasPrev: startIndex > 0
        }
      });
    } catch (error: any) {
      console.error('Get meeting requests error:', error);
      return res.status(500).json({ error: 'Failed to get meeting requests' });
    }
  }

  async getMeetingRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const meeting = await this.meetingRepository.findById(idStr);

      if (!meeting) {
        return res.status(404).json({ error: 'Meeting request not found' });
      }

      // Only admin or the user who created the meeting can view it
      if (req.user.role !== 'admin' && meeting.email !== req.user.email) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      return res.status(200).json({ meeting });
    } catch (error: any) {
      console.error('Get meeting request error:', error);
      return res.status(500).json({ error: 'Failed to get meeting request' });
    }
  }

  async respondToMeeting(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      
      // Validate input
      const validationResult = meetingResponseSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const responseData = validationResult.data;
      const { status, acceptedDate, acceptedTime, meetLink, adminMessage } = responseData;

      const meeting = await this.meetingRepository.findById(idStr);
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting request not found' });
      }

      // Prepare update data
      const updateData: any = {
        status,
        adminMessage: sanitize(adminMessage || '')
      };

      if (status === 'accepted') {
        updateData.acceptedDate = acceptedDate || meeting.requestedDate;
        updateData.acceptedTime = acceptedTime || meeting.requestedTime;
        updateData.meetLink = meetLink;
      }

      const updatedMeeting = await this.meetingRepository.update(idStr, updateData);
      if (!updatedMeeting) {
        return res.status(404).json({ error: 'Meeting request not found' });
      }

      // TODO: Send notification email to customer

      return res.status(200).json({
        message: `Meeting request ${status} successfully`,
        meeting: updatedMeeting
      });
    } catch (error: any) {
      console.error('Meeting response error:', error);
      return res.status(500).json({ error: 'Failed to respond to meeting request' });
    }
  }

  async updateMeetingRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const meeting = await this.meetingRepository.findById(idStr);
      
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting request not found' });
      }

      // Only admin or the user who created the meeting can update it
      if (req.user.role !== 'admin' && meeting.email !== req.user.email) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Validate input
      const validationResult = meetingUpdateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const updateData = validationResult.data;

      // Regular users can only update certain fields
      if (req.user.role !== 'admin') {
        // Remove admin-only fields
        delete updateData.status;
        delete updateData.acceptedDate;
        delete updateData.acceptedTime;
        delete updateData.meetLink;
        delete updateData.adminMessage;
        delete updateData.adminNotes;
      }

      const updatedMeeting = await this.meetingRepository.update(idStr, updateData);
      if (!updatedMeeting) {
        return res.status(404).json({ error: 'Meeting request not found' });
      }

      return res.status(200).json({
        message: 'Meeting request updated successfully',
        meeting: updatedMeeting
      });
    } catch (error: any) {
      console.error('Update meeting request error:', error);
      return res.status(500).json({ error: 'Failed to update meeting request' });
    }
  }

  async deleteMeetingRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const deleted = await this.meetingRepository.delete(idStr);

      if (!deleted) {
        return res.status(404).json({ error: 'Meeting request not found' });
      }

      return res.status(200).json({ 
        message: 'Meeting request deleted successfully' 
      });
    } catch (error: any) {
      console.error('Delete meeting request error:', error);
      return res.status(500).json({ error: 'Failed to delete meeting request' });
    }
  }
}