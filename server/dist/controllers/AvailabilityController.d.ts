import { Request, Response } from 'express';
import { MeetingRepository } from '../repositories/MeetingRepository';
export declare class AvailabilityController {
    private meetingRepository;
    constructor(meetingRepository: MeetingRepository);
    getAvailability(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getWeeklyAvailability(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private generateTimeSlots;
    private calculateAverageAvailability;
}
//# sourceMappingURL=AvailabilityController.d.ts.map