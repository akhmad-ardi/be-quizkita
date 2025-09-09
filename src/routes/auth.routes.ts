import { Router } from 'express';

// controller
import { AuthController } from '../controllers/auth.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { SignInSchema, SignUpSchema } from '../validations/auth.schema';

const router = Router();
const authController = new AuthController();

router.post('/sign-up', ValidateMiddleware(SignUpSchema), authController.SignUp);
router.post('/sign-in', ValidateMiddleware(SignInSchema), authController.SignIn);

export { router as AuthRouter };
