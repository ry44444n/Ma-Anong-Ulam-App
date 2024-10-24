import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

const setupMiddlewares = (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
};

export default setupMiddlewares;
