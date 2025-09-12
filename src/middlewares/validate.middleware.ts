import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export function ValidateMiddleware(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const messages = err.issues.reduce((acc, error) => {
          const field = error.path[0];
          acc[field] = error.message;
          return acc;
        }, {});

        return res.status(400).json({
          messages,
        });
      }

      const MESSAGE = 'Something Error In Validate Middleware';
      console.log(MESSAGE);

      return res.status(500).json({
        message: MESSAGE,
      });
    }
  };
}
