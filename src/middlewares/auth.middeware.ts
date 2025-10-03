import type { Request, Response, NextFunction } from 'express';
import { errors } from 'jose';
import { verifyToken } from '../lib/jwt';
import { extractBearerToken } from '../lib/utils';

export function AuthMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        throw new Error('Missing or invalid Authorization header');
      }

      const secretToken = new TextEncoder().encode((process.env.TOKEN_KEY || '').trim());

      // Verifikasi token
      const { payload } = await verifyToken(token, secretToken);

      req.user = { id: payload.id as string, username: payload.username as string };

      next();
    } catch (err) {
      if (err instanceof errors.JWTExpired || err instanceof Error) {
        return res.status(401).json({ message: err.message, is_auth: false });
      }

      if (err instanceof errors.JWSSignatureVerificationFailed) {
        return res.status(403).json({ message: err.message, is_auth: false });
      }

      if (err instanceof errors.JWTClaimValidationFailed) {
        if ((err as errors.JWTClaimValidationFailed).claim === 'nbf') {
          return res.status(401).json({ message: err.message, is_auth: false });
        }
        return res.status(403).json({ message: err.message, is_auth: false });
      }

      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'token verification failed', is_auth: false });
    }
  };
}
