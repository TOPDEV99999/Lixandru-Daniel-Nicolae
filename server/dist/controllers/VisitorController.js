"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorController = void 0;
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
function parseOS(userAgent) {
    if (/Windows NT 10/.test(userAgent))
        return 'Windows';
    if (/Windows NT/.test(userAgent))
        return 'Windows';
    if (/Mac OS X/.test(userAgent))
        return 'macOS';
    if (/Android/.test(userAgent))
        return 'Android';
    if (/iPhone|iPad|iPod/.test(userAgent))
        return 'iOS';
    if (/Linux/.test(userAgent))
        return 'Linux';
    return 'Unknown';
}
function parseDevice(userAgent) {
    if (/iPad|Tablet/.test(userAgent))
        return 'Tablet';
    if (/Mobile|Android|iPhone/.test(userAgent))
        return 'Mobile';
    return 'Desktop';
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
class VisitorController {
    visitorRepository;
    constructor(visitorRepository) {
        this.visitorRepository = visitorRepository;
    }
    async trackVisit(req, res) {
        try {
            const visitorIp = getClientIp(req);
            const userAgent = req.headers['user-agent'] || 'unknown';
            const country = req.headers['cf-ipcountry'] || 'unknown';
            const browser = parseBrowser(userAgent);
            const os = parseOS(userAgent);
            const device = parseDevice(userAgent);
            const visitorId = `${visitorIp}_${os}`;
            const existingVisitor = await this.visitorRepository.findByVisitorId(visitorId);
            if (existingVisitor) {
                // Increment visit count
                const updatedVisitor = await this.visitorRepository.incrementVisitCount(visitorId);
                return res.status(200).json({
                    success: true,
                    message: 'Visitor tracked (updated)',
                    visitor: {
                        id: updatedVisitor.id,
                        visitorId: updatedVisitor.visitorId,
                        visitCount: updatedVisitor.visitCount,
                        lastVisit: updatedVisitor.updatedAt
                    }
                });
            }
            else {
                // Create new visitor
                const newVisitor = await this.visitorRepository.create({
                    visitorId,
                    country,
                    browser,
                    device,
                    os,
                    visitorIp
                });
                return res.status(201).json({
                    success: true,
                    message: 'Visitor tracked (new)',
                    visitor: {
                        id: newVisitor.id,
                        visitorId: newVisitor.visitorId,
                        visitCount: newVisitor.visitCount,
                        createdAt: newVisitor.createdAt
                    }
                });
            }
        }
        catch (error) {
            console.error('Track visit error:', error);
            return res.status(500).json({
                error: 'Failed to track visit',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    async getVisitorAnalytics(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(String(startDate)) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
            const end = endDate ? new Date(String(endDate)) : new Date();
            const analytics = await this.visitorRepository.getAnalytics(start, end);
            return res.status(200).json({
                period: {
                    startDate: start.toISOString().split('T')[0],
                    endDate: end.toISOString().split('T')[0],
                    days: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                },
                analytics
            });
        }
        catch (error) {
            console.error('Get visitor analytics error:', error);
            return res.status(500).json({ error: 'Failed to get visitor analytics' });
        }
    }
    async getVisitors(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { country, page = 1, limit = 50 } = req.query;
            const pageNum = parseInt(String(page), 10);
            const limitNum = parseInt(String(limit), 10);
            let visitors;
            let total;
            if (country) {
                visitors = await this.visitorRepository.findByCountry(String(country));
                total = visitors.length;
            }
            else {
                visitors = await this.visitorRepository.findAll();
                total = await this.visitorRepository.count();
            }
            // Sort by visit count (descending) and then by last visit (descending)
            visitors.sort((a, b) => {
                if (b.visitCount !== a.visitCount) {
                    return b.visitCount - a.visitCount;
                }
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
            // Simple pagination
            const startIndex = (pageNum - 1) * limitNum;
            const endIndex = pageNum * limitNum;
            const paginatedVisitors = visitors.slice(startIndex, endIndex);
            return res.status(200).json({
                visitors: paginatedVisitors,
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
            console.error('Get visitors error:', error);
            return res.status(500).json({ error: 'Failed to get visitors' });
        }
    }
    async getVisitor(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { id } = req.params;
            const visitor = await this.visitorRepository.findById(id);
            if (!visitor) {
                return res.status(404).json({ error: 'Visitor not found' });
            }
            return res.status(200).json({ visitor });
        }
        catch (error) {
            console.error('Get visitor error:', error);
            return res.status(500).json({ error: 'Failed to get visitor' });
        }
    }
    async deleteVisitor(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { id } = req.params;
            const deleted = await this.visitorRepository.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Visitor not found' });
            }
            return res.status(200).json({
                message: 'Visitor deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete visitor error:', error);
            return res.status(500).json({ error: 'Failed to delete visitor' });
        }
    }
}
exports.VisitorController = VisitorController;
//# sourceMappingURL=VisitorController.js.map