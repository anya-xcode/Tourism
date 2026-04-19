import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { RegisterDTO, LoginDTO, UserRole } from '../types';
import { AppError } from '../middleware/error';

export class AuthService {
  private _googleClient: OAuth2Client | null = null;

  private get googleClient(): OAuth2Client {
    if (!this._googleClient) {
      if (!process.env.GOOGLE_CLIENT_ID) {
        console.error('CRITICAL: GOOGLE_CLIENT_ID is not defined in environment variables');
      }
      this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    return this._googleClient;
  }

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
      // Audience is strictly required to successfully verify Google signatures locally
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new AppError('Invalid Google token payload', 401);
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
    } catch (error: any) {
      console.error('CRITICAL GOOGLE AUTH FAILURE:', {
        message: error.message,
        stack: error.stack,
        details: error.response?.data || error
      });
      throw new AppError(error.message || 'Failed to authenticate with Google', 401);
    }
  }

  private generateToken(user: IUser): string {
    const payload = { id: user._id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET || 'secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
    return jwt.sign(payload, secret, { expiresIn });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  }
}
