import { UserRepository } from '../repositories/UserRepository';
import { UserRegistrationInput, UserLoginInput, UserUpdateInput } from '../validation/userValidation';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private userRepository;
    private jwtSecret;
    private jwtExpiresIn;
    private refreshTokenExpiresIn;
    constructor(userRepository: UserRepository, jwtSecret: string, jwtExpiresIn?: string, refreshTokenExpiresIn?: string);
    register(userData: UserRegistrationInput): Promise<{
        user: any;
        tokens: AuthTokens;
    }>;
    login(loginData: UserLoginInput): Promise<{
        user: any;
        tokens: AuthTokens;
    }>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    validateToken(accessToken: string): Promise<JwtPayload>;
    updateUser(userId: string, updateData: UserUpdateInput): Promise<any>;
    private generateTokens;
    private parseExpiresIn;
}
//# sourceMappingURL=AuthService.d.ts.map