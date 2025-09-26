import { nanoid } from 'nanoid';
import { DB } from '../lib/db';
import { QuestionService } from './question.service';

export class MaterialService {
  private _questionService: QuestionService;

  constructor(questionService: QuestionService) {
    this._questionService = questionService;
  }

  async addMaterial({
    userId,
    classId,
    title,
    content,
  }: {
    userId: string;
    classId: string;
    title: string;
    content: string;
  }) {
    const material_id = `material-${nanoid(16)}`;

    await DB.materials.create({
      data: {
        id: material_id,
        user_id: userId,
        class_id: classId,
        title,
        content,
      },
    });

    await this._questionService.addQuestions({ material_id, content });

    return { material_id };
  }

  async getMaterials({ userId, classId }: { userId: string; classId: string }) {
    const materials = await DB.materials.findMany({
      where: { user_id: userId, class_id: classId },
      include: { Questions: true },
      orderBy: { created_at: 'desc' },
    });

    return materials.map((material) => ({
      id: material.id,
      title: material.title,
      total_quiz: material.Questions.length,
      created_at: material.created_at,
    }));
  }

  async getMaterial({ materialId }: { materialId: string }) {
    const material = await DB.materials.findFirst({
      where: { id: materialId },
      include: { Questions: { include: { Answers: true } } },
    });

    return material.Questions.map((question) => {
      return {
        ...question,
        Answers: question.Answers.map((answer) => ({
          id: answer.id,
          question_id: answer.question_id,
          answer_text: answer.answer_text,
        })),
      };
    });
  }

  async deleteMaterial({ userId, materialId }: { userId: string; materialId: string }) {
    await DB.materials.delete({ where: { id: materialId, user_id: userId } });
  }

  async verifyMaterialOwner({ userId, materialId }: { userId: string; materialId: string }) {
    const material = await DB.materials.findFirst({ where: { id: materialId, user_id: userId } });
    if (!material) {
      throw { statusCode: 404, message: 'material not found' };
    }
  }

  async verifyMaterialExist({ materialId }: { materialId: string }) {
    const material = await DB.materials.findFirst({ where: { id: materialId } });
    if (!material) {
      throw { statusCode: 404, message: 'material not found' };
    }
  }
}
