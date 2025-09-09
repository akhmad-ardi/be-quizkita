import express, { Application } from 'express';
import dotenv from 'dotenv';

// routes
import { AuthRouter } from './routes/auth.routes';

dotenv.config();

export class App {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.get('/', (req, res) => {
      res.json({ message: 'Hello from Express + OOP + TypeScript 🚀' });
    });

    this.app.use('/auth', AuthRouter);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server ${process.env.APP_NAME} running at http://localhost:${this.port}`);
    });
  }
}
