import serverlessExpress from '@vendia/serverless-express';
import { App } from './app';

const app = new App(3000).getExpressApp();

export const handler = serverlessExpress({ app });
