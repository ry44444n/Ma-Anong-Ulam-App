import express from 'express';
import setupMiddlewares from '../middlewares/setupMiddlewares.js';
import routes from '../routes/setupRoutes.js';

const app = express();

// Setup middlewares
setupMiddlewares(app);

// Setup routes
routes(app);

// Generic route
app.get('/', (req, res) => {
  res.send('Welcome to the Ma! Anong Ulam? App!');
});

export default app;
