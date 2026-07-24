"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    userRepository;
    jwtSecret;
    jwtExpiresIn;
    refreshTokenExpiresIn;
    constructor(userRepository, jwtSecret, jwtExpiresIn = '24h', refreshTokenExpiresIn = '7d') {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
        this.refreshTokenExpiresIn = refreshTokenExpiresIn;
    }
    async register(userData) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(userData.password, 10);
        // Create user DTO
        const createUserDto = {
            email: userData.email,
            password: passwordHash,
            name: userData.name,
            role: userData.role || 'user'
        };
        // Create user
        const user = await this.userRepository.create(createUserDto);
        // Generate tokens
        const tokens = await this.generateTokens(user);
        return { user, tokens };
    }
    async login(loginData) {
        // Find user by email
        const user = await this.userRepository.findByEmail(loginData.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Validate password
        const isValidPassword = await bcrypt_1.default.compare(loginData.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        // Generate tokens
        const tokens = await this.generateTokens(user);
        return { user, tokens };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, this.jwtSecret);
            // Find user
            const user = await this.userRepository.findById(payload.userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Generate new tokens
            return await this.generateTokens(user);
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async validateToken(accessToken) {
        try {
            return jsonwebtoken_1.default.verify(accessToken, this.jwtSecret);
        }
        catch (error) {
            throw new Error('Invalid access token');
        }
    }
    async updateUser(userId, updateData) {
        const updateUserDto = {};
        if (updateData.email)
            updateUserDto.email = updateData.email;
        if (updateData.name)
            updateUserDto.name = updateData.name;
        if (updateData.role)
            updateUserDto.role = updateData.role;
        if (updateData.password) {
            updateUserDto.password = await bcrypt_1.default.hash(updateData.password, 10);
        }
        return await this.userRepository.update(userId, updateUserDto);
    }
    async generateTokens(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.refreshTokenExpiresIn
        });
        // Parse expiresIn to seconds
        const expiresIn = this.parseExpiresIn(this.jwtExpiresIn);
        return {
            accessToken,
            refreshToken,
            expiresIn
        };
    }
    parseExpiresIn(expiresIn) {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 86400; // Default to 24 hours in seconds
        }
        const [, value, unit] = match;
        const numValue = parseInt(value, 10);
        switch (unit) {
            case 's': return numValue;
            case 'm': return numValue * 60;
            case 'h': return numValue * 60 * 60;
            case 'd': return numValue * 60 * 60 * 24;
            default: return 86400;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map