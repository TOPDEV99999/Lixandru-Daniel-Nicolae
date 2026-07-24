import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository, CreateUserDto, UpdateUserDto } from '../repositories/UserRepository';
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

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtSecret: string,
    private jwtExpiresIn: string = '24h',
    private refreshTokenExpiresIn: string = '7d'
  ) {}

  async register(userData: UserRegistrationInput): Promise<{ user: any; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Create user DTO
    const createUserDto: CreateUserDto = {
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

  async login(loginData: UserLoginInput): Promise<{ user: any; tokens: AuthTokens }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, this.jwtSecret) as JwtPayload;
      
      // Find user
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      return await this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async validateToken(accessToken: string): Promise<JwtPayload> {
    try {
      return jwt.verify(accessToken, this.jwtSecret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async updateUser(userId: string, updateData: UserUpdateInput): Promise<any> {
    const updateUserDto: UpdateUserDto = {};

    if (updateData.email) updateUserDto.email = updateData.email;
    if (updateData.name) updateUserDto.name = updateData.name;
    if (updateData.role) updateUserDto.role = updateData.role;
    
    if (updateData.password) {
      updateUserDto.password = await bcrypt.hash(updateData.password, 10);
    }

    return await this.userRepository.update(userId, updateUserDto);
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    const refreshToken = jwt.sign(payload, this.jwtSecret, {
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

  private parseExpiresIn(expiresIn: string): number {
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