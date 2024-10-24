import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/middlewares/app.js';
import commentRoutes from './src/routes/commentRoutes.js';
import initSocket from './src/middlewares/socket.js'; 

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const io = initSocket(server);

    app.use('/api/comments', commentRoutes);

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Rejection:', error);
      server.close(() => process.exit(1));
    });

  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
