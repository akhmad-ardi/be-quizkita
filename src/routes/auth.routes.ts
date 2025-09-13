import { Router } from 'express';

// controller
import { AuthController } from '../controllers/auth.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { SignInSchema, SignUpSchema } from '../validations/auth.schema';
import { AsyncHandler } from '../lib/utils';

// service
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

const router = Router();

const userService = new UserService();
const authService = new AuthService(userService);

const authController = new AuthController(authService);

router.post('/sign-up', ValidateMiddleware(SignUpSchema), AsyncHandler(authController.SignUp));
router.post('/sign-in', ValidateMiddleware(SignInSchema), AsyncHandler(authController.SignIn));

export { router as AuthRouter };
