import { nanoid } from 'nanoid';

export class AuthService {
  public SignUp(username: string, fullname: string, password: string, confirm_password: string) {
    return { id: `user-${nanoid(16)}`, username, fullname, password };
  }

  public SignIn(username: string, password: string): string {
    return '';
  }
}
