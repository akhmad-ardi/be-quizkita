import { nanoid } from 'nanoid';
import { DB } from '../lib/db';
import { QuestionService } from './question.service';
import { SubmitAnswerType } from '../validations/quiz.schema';

export class QuizService {
  private _questionService: QuestionService;

  constructor(questionService: QuestionService) {
    this._questionService = questionService;
  }

  async submitAnswer({
    userId,
    materialId,
    dataAnswers,
  }: {
    userId: string;
    materialId: string;
    dataAnswers: SubmitAnswerType;
  }) {
    const id = `quiz_result-${nanoid(16)}`;

    const questions = await this._questionService.getQuestions({ materialId });
    if (dataAnswers.answers.length < questions.length) {
      throw { statusCode: 400, message: 'all questions must be answered' };
    }
    if (dataAnswers.answers.length > questions.length) {
      throw { statusCode: 400, message: 'invalid questions' };
    }

    const result = dataAnswers.answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.question_id);
      const selectedAnswer = question.Answers.find((a) => a.id === answer.answer_id);
      const correctAnswer = question.Answers.find((a) => a.is_correct).answer_text;

      return {
        question_id: question.id,
        question_text: question.question_text,
        user_answer: selectedAnswer.answer_text,
        explanation: question.explanation,
        correct_answer: correctAnswer,
        is_correct: selectedAnswer.is_correct,
      };
    });

    const totalQuestions = result.length;
    const correctAnswers = result.filter((r) => r.is_correct).length;
    const score = (correctAnswers / totalQuestions) * 100;

    await DB.userQuizResults.create({
      data: { id, user_id: userId, material_id: materialId, score },
    });

    return { score, feedback: result };
  }

  async getUserQuizResult({ materialId, userId }: { materialId: string; userId: string }) {
    const userQuizResult = await DB.userQuizResults.findFirst({
      where: { AND: [{ material_id: materialId }, { user_id: userId }] },
    });
    if (!userQuizResult) {
      throw { status: 404, message: 'user quiz result not found' };
    }

    return userQuizResult;
  }

  async verifyQuizResultAlreadyExist({
    materialId,
    userId,
  }: {
    materialId: string;
    userId: string;
  }) {
    const quizResult = await DB.userQuizResults.findFirst({
      where: { AND: [{ user_id: userId }, { material_id: materialId }] },
    });
    if (quizResult) {
      throw { status: 409, message: 'you have taken this quiz' };
    }
  }
}
