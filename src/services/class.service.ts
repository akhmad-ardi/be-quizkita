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
    const classes = await DB.classes.findMany({
      where: {
        OR: [{ user_id: userId }, { ClassMembers: { some: { user_id: userId } } }],
      },
      include: { Materials: true },
      orderBy: {
        created_at: 'desc',
      },
    });

    return classes.map((c) => ({
      id: c.id,
      name: c.name,
      total_quiz: c.Materials.length,
      created_at: c.created_at,
    }));
  }

  async getClass(classId: string) {
    const _class = await DB.classes.findFirst({ where: { id: classId } });

    return _class;
  }

  async deleteClass(classId: string) {
    await DB.classes.delete({ where: { id: classId } });
  }

  async verifyClassOwner({ classId, userId }: { classId: string; userId: string }) {
    const _class = await DB.classes.findFirst({ where: { id: classId, user_id: userId } });
    if (!_class) {
      throw { statusCode: 404, message: 'class not found' };
    }
  }

  async verifyClassExist(id: string) {
    const _class = await DB.classes.findFirst({ where: { id } });
    if (!_class) {
      throw { statusCode: 404, message: 'class not found' };
    }
  }
}
