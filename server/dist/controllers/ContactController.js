"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const contactValidation_1 = require("../validation/contactValidation");
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
function sanitize(str) {
    return String(str).replace(/<[^>]*>/g, '').trim();
}
function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (Array.isArray(xForwardedFor)) {
        return xForwardedFor[0].split(',')[0].trim();
    }
    else if (typeof xForwardedFor === 'string') {
        return xForwardedFor.split(',')[0].trim();
    }
    const cfConnectingIp = req.headers['cf-connecting-ip'];
    if (cfConnectingIp) {
        return String(cfConnectingIp);
    }
    return req.ip || 'unknown';
}
class ContactController {
    contactRepository;
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async submitContact(req, res) {
        try {
            // Validate input
            const validationResult = contactValidation_1.contactMessageSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            const { fullName, full_name, email, message, visitorIp, browser, country, userId } = validationResult.data;
            // Get user from optional auth middleware
            const user = req.user;
            // Handle both field names (fullName from backend, full_name from frontend)
            const nameValue = fullName || full_name || '';
            // Sanitize inputs
            const cleanName = sanitize(nameValue);
            const cleanEmail = sanitize(email);
            const cleanMessage = sanitize(message);
            // Get visitor information
            const clientIp = visitorIp || getClientIp(req);
            const userAgent = req.headers['user-agent'] || 'unknown';
            const detectedBrowser = browser || parseBrowser(userAgent);
            const detectedCountry = country || req.headers['cf-ipcountry'] || 'unknown';
            // Rate limiting check (simplified - would need proper implementation)
            const recentContacts = await this.contactRepository.findByEmail(cleanEmail);
            const oneHourAgo = new Date(Date.now() - 3600000);
            const recentCount = recentContacts.filter(contact => new Date(contact.createdAt) > oneHourAgo).length;
            if (recentCount >= 3) {
                return res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            }
            // Create contact message DTO
            const createContactDto = {
                fullName: cleanName,
                email: cleanEmail,
                message: cleanMessage,
                visitorIp: clientIp,
                browser: detectedBrowser,
                country: detectedCountry,
                userId: user?.userId || userId
            };
            // Create contact message
            const contactMessage = await this.contactRepository.create(createContactDto);
            // TODO: Implement email notification (would need email service setup)
            const emailSent = false; // Placeholder
            return res.status(201).json({
                success: true,
                message: 'Contact message submitted successfully',
                id: contactMessage.id,
                emailSent,
                contact: {
                    id: contactMessage.id,
                    fullName: contactMessage.fullName,
                    email: contactMessage.email,
                    status: contactMessage.status,
                    createdAt: contactMessage.createdAt
                }
            });
        }
        catch (error) {
            console.error('Contact submission error:', error);
            return res.status(500).json({
                error: 'Failed to submit contact message',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    async getContactMessages(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            // Only admin can view all contact messages
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            const { status, page = 1, limit = 20 } = req.query;
            const pageNum = parseInt(String(page), 10);
            const limitNum = parseInt(String(limit), 10);
            let messages;
            let total;
            if (status) {
                messages = await this.contactRepository.findByStatus(String(status));
                total = await this.contactRepository.countByStatus(String(status));
            }
            else {
                messages = await this.contactRepository.findAll();
                total = await this.contactRepository.count();
            }
            // Simple pagination
            const startIndex = (pageNum - 1) * limitNum;
            const endIndex = pageNum * limitNum;
            const paginatedMessages = messages.slice(startIndex, endIndex);
            return res.status(200).json({
                messages: paginatedMessages,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                    hasNext: endIndex < total,
                    hasPrev: startIndex > 0
                }
            });
        }
        catch (error) {
            console.error('Get contact messages error:', error);
            return res.status(500).json({ error: 'Failed to get contact messages' });
        }
    }
    async getContactMessage(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { id } = req.params;
            const message = await this.contactRepository.findById(id);
            if (!message) {
                return res.status(404).json({ error: 'Contact message not found' });
            }
            // Only admin or the user who created the message can view it
            if (req.user.role !== 'admin' && message.userId !== req.user.userId) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            return res.status(200).json({ message });
        }
        catch (error) {
            console.error('Get contact message error:', error);
            return res.status(500).json({ error: 'Failed to get contact message' });
        }
    }
    async updateContactStatus(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { id } = req.params;
            // Validate input
            const validationResult = contactValidation_1.contactUpdateSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            const updateData = validationResult.data;
            const updatedMessage = await this.contactRepository.update(id, updateData);
            if (!updatedMessage) {
                return res.status(404).json({ error: 'Contact message not found' });
            }
            return res.status(200).json({
                message: 'Contact message updated successfully',
                contact: updatedMessage
            });
        }
        catch (error) {
            console.error('Update contact status error:', error);
            return res.status(500).json({ error: 'Failed to update contact message' });
        }
    }
    async deleteContactMessage(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { id } = req.params;
            const deleted = await this.contactRepository.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Contact message not found' });
            }
            return res.status(200).json({
                message: 'Contact message deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete contact message error:', error);
            return res.status(500).json({ error: 'Failed to delete contact message' });
        }
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=ContactController.js.map