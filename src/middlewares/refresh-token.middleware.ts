import type { Request, Response, NextFunction } from 'express';
import { verifyToken, secretRefreshToken } from '../lib/jwt';
import { extractBearerToken } from '../lib/utils';

export function RefreshTokenMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
      }

      // Verifikasi token
      const { payload } = await verifyToken(token, secretRefreshToken);

      req.user = { id: payload.id as string, username: payload.username as string };

      next();
    } catch (err) {
      console.error('RefreshTokenMiddleware error:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
}
