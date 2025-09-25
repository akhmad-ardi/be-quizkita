import { Router } from 'express';

// controller
import { UserController } from '../controllers/user.controller';

// service
import { UserService } from '../services/user.service';

// lib
import { AsyncHandler } from '../lib/utils';

const router = Router();

const userService = new UserService();

const userController = new UserController(userService);

router.get('/auth', AsyncHandler(userController.GetAuthUser));

export { router as UserRouter };
