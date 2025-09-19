import { Router } from 'express';

// controller
import { ClassController } from '../controllers/class.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { AddClassSchema, AddUserToClassSchema, JoinClassSchema } from '../validations/class.schema';

// service
import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';

// lib
import { AsyncHandler } from '../lib/utils';
import { ClassMemberService } from '../services/class-member.service';

const router = Router();

const classMemberService = new ClassMemberService();
const classService = new ClassService();
const userService = new UserService();

const classController = new ClassController(classService, classMemberService, userService);

router.post('/', ValidateMiddleware(AddClassSchema), AsyncHandler(classController.addClass));

router.get('/', AsyncHandler(classController.getClasses));

router.post('/join', ValidateMiddleware(JoinClassSchema), AsyncHandler(classController.joinClass));

router.post(
  '/:classId/user',
  ValidateMiddleware(AddUserToClassSchema),
  AsyncHandler(classController.addUserToClass)
);

export { router as ClassRouter };
