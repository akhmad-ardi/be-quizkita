import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt';

export function GuestMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader?.startsWith('Bearer ')) {
        // tidak ada token → lanjut sebagai guest
        return next();
      }

      const token = authHeader.split(' ')[1];

      // kalau token valid → berarti user sudah login
      await verifyToken(token);

      return res.status(403).json({
        message: 'You are already logged in',
      });
    } catch {
      // token invalid/expired → lanjut sebagai guest
      return next();
    }
  };
}
