import { NextFunction, Request, Response } from 'express';
import { errors } from 'jose';
import { secretToken, verifyToken } from '../lib/jwt';

export function GuestMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.split(' ')[1];

      await verifyToken(token, secretToken);

      return res.status(409).json({
        message: 'You are already signed in',
        is_auth: true,
      });
    } catch (err) {
      if (
        err instanceof errors.JWTExpired ||
        err instanceof errors.JWSSignatureVerificationFailed ||
        err instanceof errors.JWTClaimValidationFailed
      ) {
        return next();
      }

      console.error('GuestMiddleware error:', err);
      return res.status(500).json({ message: 'internal server error', is_auth: false });
    }
  };
}
