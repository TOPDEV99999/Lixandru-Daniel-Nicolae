import { Response } from 'express';
import { VisitorRepository } from '../repositories/VisitorRepository';
import { MeetingRepository } from '../repositories/MeetingRepository';
import { ContactRepository } from '../repositories/ContactRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare class AdminController {
    private visitorRepository;
    private meetingRepository;
    private contactRepository;
    private userRepository;
    constructor(visitorRepository: VisitorRepository, meetingRepository: MeetingRepository, contactRepository: ContactRepository, userRepository: UserRepository);
    getAdminData(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    private getTopItems;
    private groupByStatus;
    private groupByRole;
    private calculateVisitTrend;
    private getRecentActivity;
    private calculateResponseRate;
    private calculateGrowthRate;
    private calculateEngagementRate;
    private parsePeriod;
    private calculateMeetingConversionRate;
    private calculateAverageResponseTime;
}
//# sourceMappingURL=AdminController.d.ts.map