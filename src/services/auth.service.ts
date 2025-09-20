import bcrypt from 'bcrypt';
import { DB } from '../lib/db';
import { UserService } from './user.service';
import {
  generateRefreshToken,
  generateAccessToken,
  verifyToken,
  secretRefreshToken,
} from '../lib/jwt';

export class AuthService {
  private _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  async SignUp(username: string, fullname: string, password: string) {
    await this._userService.verifyUsernameAlreadyExist(username);

    await this._userService.addUser(username, fullname, password);
  }

  async SignIn(username: string, password: string) {
    const user = await this._userService.getUser(username);
    const credentialValid = user ? await bcrypt.compare(password, user.password) : false;

    if (!credentialValid) {
      throw { statusCode: 401, message: 'invalid username or password' };
    }

    const accessToken = await generateAccessToken(user.id, user.username);
    const refreshToken = await generateRefreshToken(user.id, user.username);

    await DB.token.create({ data: { token: refreshToken } });

    return { accessToken, refreshToken };
  }

  async RefreshToken(token: string) {
    const refreshToken = await DB.token.findFirst({ where: { token } });
    if (!refreshToken) {
      throw { statusCode: 404, message: 'Refresh Token Not Found, Please Sign In' };
    }

    try {
      const { payload } = await verifyToken(refreshToken.token, secretRefreshToken);

      const accessToken = await generateAccessToken(
        payload.id as string,
        payload.username as string
      );

      return { accessToken, refreshToken: refreshToken.token };
    } catch (error) {
      throw { statusCode: 401, message: 'Invalid or expired token' };
    }
  }
}
