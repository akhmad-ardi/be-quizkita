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
}
