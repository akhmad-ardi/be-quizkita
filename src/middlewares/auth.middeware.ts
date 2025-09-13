import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export function AuthMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ambil Authorization header
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
      }

      const token = authHeader.split(' ')[1]; // ambil token setelah "Bearer"

      // Verifikasi token
      const { payload } = await verifyToken(token);

      // Simpan payload ke request (supaya bisa diakses route handler)
      (req as any).user = payload;

      next();
    } catch (err) {
      console.error('AuthMiddleware error:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
}
