import { nanoid } from 'nanoid';
import { DB } from '../lib/db';
import { QuestionService } from './question.service';

export class MaterialService {
  private _questionService: QuestionService;

  constructor(questionService: QuestionService) {
    this._questionService = questionService;
  }

  async addMaterial(userId: string, classId: string, title: string, content: string) {
    const id = `material-${nanoid(16)}`;

    /**
     * - Generate Quiz
     * - Save data
     * */

    await DB.materials.create({
      data: {
        id,
        user_id: userId,
        class_id: classId,
        title,
        content,
      },
    });
  }

  async getMaterials(userId: string, classId: string) {
    const materials = await DB.materials.findMany({
      where: { user_id: userId, class_id: classId },
    });

    return materials;
  }

  async getMaterial() {}
}
