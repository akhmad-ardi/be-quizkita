import type { Request, Response, NextFunction } from 'express';
import type { ZodObject } from 'zod';

export function ValidateMiddleware(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (err: any) {
      return res.status(400).json({
        error: err.errors,
      });
    }
  };
}
