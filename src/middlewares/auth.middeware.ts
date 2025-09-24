import type { Request, Response, NextFunction } from 'express';
import { errors } from 'jose';
import { verifyToken, secretToken } from '../lib/jwt';
import { extractBearerToken } from '../lib/utils';

export function AuthMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
      }

      // Verifikasi token
      const { payload } = await verifyToken(token, secretToken);

      req.user = { id: payload.id as string, username: payload.username as string };

      next();
    } catch (err) {
      if (err instanceof errors.JWTExpired) {
        return res.status(401).json({ message: 'token expired', is_auth: false });
      }

      if (err instanceof errors.JWSSignatureVerificationFailed) {
        return res.status(403).json({ message: 'invalid token signature', is_auth: false });
      }

      if (err instanceof errors.JWTClaimValidationFailed) {
        if ((err as errors.JWTClaimValidationFailed).claim === 'nbf') {
          return res.status(401).json({ message: 'token not active yet', is_auth: false });
        }
        return res.status(403).json({ message: 'invalid token claims', is_auth: false });
      }

      console.error('JWT verification error:', err);
      return res.status(400).json({ message: 'token verification failed', is_auth: false });
    }
  };
}
