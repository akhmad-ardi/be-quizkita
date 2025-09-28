import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { QuizService } from '../services/quiz.service';
import { SubmitAnswerType } from '../validations/quiz.schema';

export class QuizController {
  _quizService: QuizService;

  constructor(quizService: QuizService) {
    this._quizService = quizService;

    autoBind(this);
  }

  async SubmitAnswer(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { materialId } = req.params;
    const { answers } = req.body as SubmitAnswerType;

    await this._quizService.verifyQuizResult();
    const { score, feedback } = await this._quizService.submitAnswer({
      userId: credentialId,
      materialId,
      dataAnswers: { answers },
    });

    return res.status(201).json({ data: { score, feedback } });
  }
}
