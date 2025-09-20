import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;

    autoBind(this);
  }

  async SignUp(req: Request, res: Response) {
    const { username, fullname, password } = req.body;

    await this._authService.SignUp(username, fullname, password);

    return res.status(201).json({ message: 'successfully sign up' });
  }

  async SignIn(req: Request, res: Response) {
    const { username, password } = req.body;

    const { accessToken, refreshToken } = await this._authService.SignIn(username, password);

    return res.status(200).json({
      data: {
        accessToken,
        refreshToken,
      },
    });
  }

  async RefreshToken(req: Request, res: Response) {
    const { id, username } = req.user;

    const accessToken = await this._authService.RefreshToken(id, username);

    return res.status(200).json({
      data: { accessToken },
    });
  }
}
