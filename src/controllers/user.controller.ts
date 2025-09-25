import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { UserService } from '../services/user.service';

export class UserController {
  _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;

    autoBind(this);
  }

  async GetAuthUser(req: Request, res: Response) {
    const { username } = req.user;

    const user = await this._userService.getUser(username, {
      id: true,
      username: true,
      fullname: true,
    });

    return res.status(200).json({ data: { user } });
  }
}
