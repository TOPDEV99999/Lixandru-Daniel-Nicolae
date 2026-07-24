import { Request, Response } from 'express';
import { MeetingRepository } from '../repositories/MeetingRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { VisitorRepository } from '../repositories/VisitorRepository';
export declare class MeetingController {
    private meetingRepository;
    private visitorRepository;
    constructor(meetingRepository: MeetingRepository, visitorRepository: VisitorRepository);
    submitMeeting(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getMeetingRequests(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getMeetingRequest(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    respondToMeeting(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMeetingRequest(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteMeetingRequest(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=MeetingController.d.ts.map