import { Request, Response } from 'express';
import { VisitorRepository } from '../repositories/VisitorRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare class VisitorController {
    private visitorRepository;
    constructor(visitorRepository: VisitorRepository);
    trackVisit(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getVisitorAnalytics(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getVisitors(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getVisitor(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteVisitor(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=VisitorController.d.ts.map