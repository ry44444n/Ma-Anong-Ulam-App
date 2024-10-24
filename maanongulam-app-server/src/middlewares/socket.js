import { Server } from 'socket.io';

let chatHistory = []; 

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Send previous messages when a user connects
    socket.emit('previousMessages', chatHistory);

    socket.on('chatMessage', (message) => {
      try {
        console.log('Message received:', message);

        if (message.user && message.text) {
          chatHistory.push(message); 
          io.emit('chatMessage', message);
        } else {
          console.error('Invalid message structure:', message);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    socket.on('typing', (user) => {
      socket.broadcast.emit('typing', user); 
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error for user ${socket.id}:`, err);
    });
  });

  return io;
};

export default initSocket;
