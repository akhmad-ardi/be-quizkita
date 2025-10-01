import { Router } from 'express';

// controller
import { QuizController } from '../controllers/quiz.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { SubmitAnswerSchema } from '../validations/quiz.schema';

// service
import { QuizService } from '../services/quiz.service';
import { MaterialService } from '../services/material.service';
import { QuestionService } from '../services/question.service';

// lib
import { AsyncHandler } from '../lib/utils';

const router = Router();

const questionService = new QuestionService();
const materialService = new MaterialService(questionService);
const quizService = new QuizService(questionService);

const quizController = new QuizController(quizService, materialService);

router.post(
  '/:materialId',
  ValidateMiddleware(SubmitAnswerSchema),
  AsyncHandler(quizController.SubmitAnswer)
);

router.get('/:materialId', AsyncHandler(quizController.GetUserQuizResult));

export { router as QuizRouter };
