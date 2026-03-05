import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class AuthController {
  private authService = ServiceFactory.getInstance().getAuthService();

  register = async (req: AuthRequest, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(201).json(result);
  };

  login = async (req: AuthRequest, res: Response) => {
    const result = await this.authService.login(req.body);
    res.status(200).json(result);
  };

  googleAuth = async (req: AuthRequest, res: Response) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ status: 'error', message: 'Token is required' });
    }
    const result = await this.authService.googleLogin(token);
    res.status(200).json(result);
  };

  getMe = async (req: AuthRequest, res: Response) => {
    const user = await this.authService.getUserById(req.user!.id);
    res.status(200).json(user);
  };
}
