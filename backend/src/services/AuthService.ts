import { AuthService } from './AuthService';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { RegisterDTO, LoginDTO, UserRole } from '../types';
import { AppError } from '../middleware/error';

const googleClient = new OAuth2Client();

export class AuthService {
  async register(data: RegisterDTO): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(data: LoginDTO): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.password) {
      throw new AppError('This email is associated with a Google account. Please use Continue with Google.', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async googleLogin(idToken: string): Promise<{ user: IUser; token: string }> {
    try {
      // For a robust production env, specify audience: process.env.GOOGLE_CLIENT_ID
      const ticket = await googleClient.verifyIdToken({
        idToken,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new AppError('Invalid Google token', 401);
      }

      const { sub: googleId, email, name, picture } = payload;

      let user = await User.findOne({ email });

      if (user) {
        // If the user signed up natively but is now using Google, link the account
        if (!user.googleId) {
          user.googleId = googleId;
          if (!user.avatar && picture) user.avatar = picture;
          await user.save();
        }
      } else {
        // Create a new user from Google payload
        user = await User.create({
          name: name || 'Explorer',
          email,
          googleId,
          avatar: picture || '',
        });
      }

      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      console.error('Google OAuth Error:', error);
      throw new AppError('Failed to authenticate with Google', 401);
    }
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  }
}
