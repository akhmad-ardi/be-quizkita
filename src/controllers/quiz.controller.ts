import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { QuizService } from '../services/quiz.service';
import { SubmitAnswerType } from '../validations/quiz.schema';
import { MaterialService } from '../services/material.service';

export class QuizController {
  private _quizService: QuizService;
  private _materialService: MaterialService;

  constructor(quizService: QuizService, materialService: MaterialService) {
    this._quizService = quizService;
    this._materialService = materialService;

    autoBind(this);
  }

  async SubmitAnswer(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { materialId } = req.params;
    const { answers } = req.body as SubmitAnswerType;

    await this._quizService.verifyQuizResultAlreadyExist({ materialId, userId: credentialId });
    const { score, feedback } = await this._quizService.submitAnswer({
      userId: credentialId,
      materialId,
      dataAnswers: { answers },
    });

    return res.status(201).json({ data: { score, feedback } });
  }

  async GetUserQuizResult(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { materialId } = req.params;

    await this._materialService.verifyMaterialExist({ materialId });
    const userQuizResult = await this._quizService.getUserQuizResult({
      materialId,
      userId: credentialId,
    });

    return res.status(200).json({ data: userQuizResult });
  }
}
