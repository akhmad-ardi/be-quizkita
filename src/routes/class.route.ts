import { Router } from 'express';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { AddClassSchema, AddUserToClassSchema, JoinClassSchema } from '../validations/class.schema';
import { ClassController } from '../controllers/class.controller';
import { AsyncHandler } from '../lib/utils';
import { AuthMiddleware } from '../middlewares/auth.middeware';
import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';

const router = Router();

const classService = new ClassService();
const userService = new UserService();

const classController = new ClassController(classService, userService);

router.post(
  '/',
  AuthMiddleware(),
  ValidateMiddleware(AddClassSchema),
  AsyncHandler(classController.addClass)
);

router.get('/', AuthMiddleware(), AsyncHandler(classController.getClasses));

router.post(
  '/join',
  AuthMiddleware(),
  ValidateMiddleware(JoinClassSchema),
  AsyncHandler(classController.joinClass)
);

router.post(
  '/:classId/user',
  AuthMiddleware(),
  ValidateMiddleware(AddUserToClassSchema),
  AsyncHandler(classController.addUserToClass)
);

export { router as ClassRouter };
