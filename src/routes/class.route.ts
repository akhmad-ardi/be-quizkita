import { Router } from 'express';

// controller
import { ClassController } from '../controllers/class.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import {
  AddClassSchema,
  AddUserToClassSchema,
  DeleteClassMemberSchema,
  JoinClassSchema,
} from '../validations/class.schema';

// service
import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';

// lib
import { AsyncHandler } from '../lib/utils';
import { ClassMemberService } from '../services/class-member.service';
import { MaterialService } from '../services/material.service';
import { QuestionService } from '../services/question.service';

const router = Router();

const classMemberService = new ClassMemberService();
const classService = new ClassService();
const userService = new UserService();
const questionService = new QuestionService();
const materialService = new MaterialService(questionService);

const classController = new ClassController(
  classService,
  classMemberService,
  userService,
  materialService
);

router.post('/', ValidateMiddleware(AddClassSchema), AsyncHandler(classController.addClass));

router.post('/join', ValidateMiddleware(JoinClassSchema), AsyncHandler(classController.joinClass));

router.post(
  '/:classId/user',
  ValidateMiddleware(AddUserToClassSchema),
  AsyncHandler(classController.addUserToClass)
);

router.get('/', AsyncHandler(classController.getClasses));

router.delete('/:classId', AsyncHandler(classController.deleteClass));

router.delete(
  '/:classId/class-members',
  ValidateMiddleware(DeleteClassMemberSchema),
  AsyncHandler(classController.deleteClassMember)
);

router.get('/:classId/leaderboard', AsyncHandler(classController.getLeaderboard));

export { router as ClassRouter };
