import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();

    autoBind(this);
  }

  public SignUp(req: Request, res: Response) {
    return res.status(201).json({ message: 'Sign Up Endpoint' });
  }

  public SignIn(req: Request, res: Response) {
    return res.status(200).json({ message: 'Sign In Endpoint' });
  }
}
