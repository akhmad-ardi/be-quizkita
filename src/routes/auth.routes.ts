import { Router } from 'express';

// controller
import { AuthController } from '../controllers/auth.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { GuestMiddleware } from '../middlewares/guest.middleware';

// schema
import { RefreshTokenSchema, SignInSchema, SignUpSchema } from '../validations/auth.schema';

// service
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

// lib
import { AsyncHandler } from '../lib/utils';

const router = Router();

const userService = new UserService();
const authService = new AuthService(userService);

const authController = new AuthController(authService);

router.post(
  '/sign-up',
  GuestMiddleware(),
  ValidateMiddleware(SignUpSchema),
  AsyncHandler(authController.SignUp)
);

router.post(
  '/sign-in',
  GuestMiddleware(),
  ValidateMiddleware(SignInSchema),
  AsyncHandler(authController.SignIn)
);

router.post(
  '/refresh-token',
  ValidateMiddleware(RefreshTokenSchema),
  AsyncHandler(authController.RefreshToken)
);

export { router as AuthRouter };
