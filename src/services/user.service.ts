import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { DB } from '../lib/db';
import { Prisma } from '@prisma/client';

export class UserService {
  async addUser(username: string, fullname: string, password: string) {
    const id = `user-${nanoid(16)}`;

    const passwordHashed = await bcrypt.hash(password, 10);

    await DB.users.create({
      data: {
        id,
        username,
        fullname,
        password: passwordHashed,
      },
    });
  }

  async getUser(username: string) {
    const user = await DB.users.findFirst({ where: { username } });
    if (!user) {
      throw { statusCode: 404, message: 'user not found' };
    }

    return user;
  }

  async verifyUsernameAlreadyExist(username: string) {
    const user = await DB.users.findFirst({ where: { username } });
    if (user) {
      throw { statusCode: 409, message: 'username already exist' };
    }
  }

  async verifyUserExist(username: string) {
    const user = await DB.users.findFirst({ where: { username } });
    if (!user) {
      throw { statusCode: 404, message: 'user not found' };
    }
  }
}
