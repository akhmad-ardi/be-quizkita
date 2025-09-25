import { nanoid } from 'nanoid';
import { DB } from '../lib/db';

export class ClassMemberService {
  async addClassMember(userId: string, classId: string) {
    const id = `class-${nanoid(16)}`;

    await DB.classMembers.create({
      data: {
        id,
        user_id: userId,
        class_id: classId,
      },
    });
  }

  async deleteClassMember(classId: string, userId: string) {
    await DB.classMembers.deleteMany({ where: { class_id: classId, user_id: userId } });
  }

  async verifyClassMember(classId: string, userId: string) {
    const checkClassOwner = await DB.classes.findFirst({ where: { user_id: userId } });
    const checkClassMember = await DB.classMembers.findFirst({
      where: { class_id: classId, user_id: userId },
    });

    if (checkClassOwner || checkClassMember) {
      throw { statusCode: 409, message: 'user already exist in class' };
    }
  }
}
