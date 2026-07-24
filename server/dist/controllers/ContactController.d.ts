import { Request, Response } from 'express';
import { ContactRepository } from '../repositories/ContactRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare class ContactController {
    private contactRepository;
    constructor(contactRepository: ContactRepository);
    submitContact(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getContactMessages(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getContactMessage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateContactStatus(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteContactMessage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ContactController.d.ts.map