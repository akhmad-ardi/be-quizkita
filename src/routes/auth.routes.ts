import { Router } from 'express';

// controller
import { AuthController } from '../controllers/auth.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { SignInSchema, SignUpSchema } from '../validations/auth.schema';
import { AsyncHandler } from '../lib/utils';

const router = Router();
const authController = new AuthController();

router.post('/sign-up', ValidateMiddleware(SignUpSchema), AsyncHandler(authController.SignUp));
router.post('/sign-in', ValidateMiddleware(SignInSchema), AsyncHandler(authController.SignIn));

export { router as AuthRouter };
