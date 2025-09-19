import { nanoid } from 'nanoid';
import { DB } from '../lib/db';

export class ClassService {
  async addClass(user_id: string, name: string) {
    const id = `class-${nanoid(16)}`;

    const _class = await DB.classes.create({
      data: {
        id,
        user_id,
        name,
      },
    });

    return _class;
  }

  async getClasses(userId: string) {
    const classes = await DB.classMembers.findMany({
      where: { user_id: userId },
      select: { Class: true },
    });

    return classes.map((c) => c.Class);
  }

  async deleteClass(classId: string) {
    await DB.classes.delete({ where: { id: classId } });
  }

  async verifyClassExist(id: string) {
    const _class = await DB.classes.findFirst({ where: { id } });
    if (!_class) {
      throw { statusCode: 404, message: 'class not found' };
    }
  }

  async verifyUserInClass(userId: string, classId: string) {
    const _class = await DB.classMembers.findFirst({
      where: { class_id: classId, user_id: userId },
    });
    if (_class) {
      throw { statusCode: 409, message: 'user already exist in class' };
    }
  }
}
