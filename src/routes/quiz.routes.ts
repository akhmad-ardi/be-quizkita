import { Router } from 'express';

// controller
import { QuizController } from '../controllers/quiz.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { SubmitAnswerSchema } from '../validations/quiz.schema';

// service
import { QuizService } from '../services/quiz.service';
import { QuestionService } from '../services/question.service';

// lib
import { AsyncHandler } from '../lib/utils';

const router = Router();

const questionService = new QuestionService();
const quizService = new QuizService(questionService);

const quizController = new QuizController(quizService);

router.post(
  '/:materialId',
  ValidateMiddleware(SubmitAnswerSchema),
  AsyncHandler(quizController.SubmitAnswer)
);

export { router as QuizRouter };
