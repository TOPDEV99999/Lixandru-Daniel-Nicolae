import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare class AuthController {
    private authService;
    constructor(userRepository: UserRepository);
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AuthController.d.ts.map