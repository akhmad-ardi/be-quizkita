import { nanoid } from 'nanoid';
import { DB } from '../lib/db';
import { GenerateQuestions } from '../lib/aws-bedrock';

export class QuestionService {
  async addQuestions({ material_id, content }: { material_id: string; content: string }) {
    const generateQuestions = await GenerateQuestions({ content });

    const questions = generateQuestions.map((question) => {
      const question_id = `question-${nanoid(16)}`;

      const answers = question.options.map((answer) => {
        const answer_id = `answer-${nanoid(16)}`;
        const is_correct = question.answer === answer.charAt(0);

        return {
          id: answer_id,
          question_id,
          answer_text: answer,
          is_correct,
        };
      });

      return {
        id: question_id,
        question_text: question.question,
        explanation: question.explanation,
        answers,
      };
    });

    const data_questions = questions.map((question) => ({
      id: question.id,
      material_id,
      question_text: question.question_text,
      explanation: question.explanation,
    }));

    await DB.questions.createMany({
      data: data_questions,
    });

    const data_answers = questions.flatMap((question) => question.answers.map((answer) => answer));

    await DB.answers.createMany({
      data: data_answers,
    });
  }

  async getQuestions({ materialId }: { materialId: string }) {
    const questions = await DB.questions.findMany({
      where: { material_id: materialId },
      include: { Answers: true },
    });

    return questions;
  }
}
