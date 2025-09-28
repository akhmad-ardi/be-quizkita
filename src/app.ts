import express, { Application, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

// routes
import { AuthRouter } from './routes/auth.routes';
import { UserRouter } from './routes/user.routes';
import { ClassRouter } from './routes/class.route';
import { MaterialRouter } from './routes/material.routes';
import { QuizRouter } from './routes/quiz.routes';

// middlewares
import { AuthMiddleware } from './middlewares/auth.middeware';

dotenv.config();

export class App {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // Middlewares
  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );
    this.app.use(express.json());
  }

  // Routes
  private initializeRoutes() {
    this.app.get('/', (req, res) => {
      res.json({ message: 'Hello from Express + OOP + TypeScript 🚀' });
    });

    this.app.use('/auth', AuthRouter);
    this.app.use('/users', AuthMiddleware(), UserRouter);
    this.app.use('/classes', AuthMiddleware(), ClassRouter);
    this.app.use('/materials', AuthMiddleware(), MaterialRouter);
    this.app.use('/quiz', AuthMiddleware(), QuizRouter);

    this.app.use((req: Request, res: Response) => {
      return res.status(404).json({ message: 'url not found' });
    });
  }

  // Error Handling Middleware
  private initializeErrorHandling() {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('🔥 Error:', err);

      let status = err.statusCode || 500;
      let message = err.message || 'Internal Server Error';

      // Prisma error handling
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Contoh: Unique constraint failed
        if (err.code === 'P2002') {
          status = 400;
          message = `Duplicate field value: ${err.meta?.target}`;
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        status = 400;
        message = 'Invalid request to database';
      }

      return res.status(status).json({ message });
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server ${process.env.APP_NAME} running at http://localhost:${this.port}`);
    });
  }
}
