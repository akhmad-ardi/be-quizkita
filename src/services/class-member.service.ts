import { nanoid } from 'nanoid';
import { DB } from '../lib/db';

export class ClassMemberService {
  async addClassMember({ userId, classId }: { userId: string; classId: string }) {
    const id = `class-${nanoid(16)}`;

    await DB.classMembers.create({
      data: {
        id,
        user_id: userId,
        class_id: classId,
      },
    });
  }

  async getClassMembers(classId: string) {
    const classMembers = await DB.classMembers.findMany({
      where: { class_id: classId },
    });

    return classMembers;
  }

  async deleteClassMember({ classId, userId }: { classId: string; userId: string }) {
    await DB.classMembers.deleteMany({ where: { class_id: classId, user_id: userId } });
  }

  async verifyClassMember({ classId, userId }: { classId: string; userId: string }) {
    const checkClassOwner = await DB.classes.findFirst({ where: { user_id: userId } });
    const checkClassMember = await DB.classMembers.findFirst({
      where: { class_id: classId, user_id: userId },
    });

    if (!checkClassOwner && !checkClassMember) {
      throw { statusCode: 404, message: 'user is not in class' };
    }
  }

  async verifyClassMemberAlreadyExist({ classId, userId }: { classId: string; userId: string }) {
    const checkClassOwner = await DB.classes.findFirst({ where: { user_id: userId } });
    const checkClassMember = await DB.classMembers.findFirst({
      where: { class_id: classId, user_id: userId },
    });

    if (checkClassOwner || checkClassMember) {
      throw { statusCode: 409, message: 'user already exist in class' };
    }
  }
}
