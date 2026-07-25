import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { userRegistrationSchema, userLoginSchema, userUpdateSchema } from '../validation/userValidation';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  private authService: AuthService;

  constructor(userRepository: UserRepository) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    this.authService = new AuthService(userRepository, jwtSecret, process.env.JWT_EXPIRES_IN);
  }

  async register(req: Request, res: Response) {
    try {
      // Validate input
      const validationResult = userRegistrationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const userData = validationResult.data;

      // Register user
      const result = await this.authService.register(userData);

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = result.user;

      return res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword,
        tokens: result.tokens
      });
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ error: error.message });
      }
      
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Validate input
      const validationResult = userLoginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const loginData = validationResult.data;

      // Login user
      const result = await this.authService.login(loginData);

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = result.user;

      return res.status(200).json({
        message: 'Login successful',
        user: userWithoutPassword,
        tokens: result.tokens
      });
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ error: error.message });
      }
      
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      return res.status(200).json({
        message: 'Token refreshed successfully',
        tokens
      });
    } catch (error: any) {
      if (error.message === 'Invalid refresh token') {
        return res.status(401).json({ error: error.message });
      }
      
      console.error('Refresh token error:', error);
      return res.status(500).json({ error: 'Token refresh failed' });
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // In a real implementation, you would fetch the user from the repository
      // For now, return the JWT payload
      return res.status(200).json({
        user: req.user
      });
    } catch (error: any) {
      console.error('Get current user error:', error);
      return res.status(500).json({ error: 'Failed to get user information' });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Validate input
      const validationResult = userUpdateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const updateData = validationResult.data;

      // Update user
      const updatedUser = await this.authService.updateUser(req.user.userId, updateData);

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Profile update failed' });
    }
  }
}