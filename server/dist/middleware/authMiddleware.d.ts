import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../services/AuthService';
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export declare const authMiddleware: (requiredRole?: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const optionalAuthMiddleware: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map