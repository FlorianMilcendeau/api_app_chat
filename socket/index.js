const socketIO = require('socket.io');

const { authenticateJwt } = require('../middlewares/socketMiddleware');
const messageHandler = require('./messageHandler');
const channelHandler = require('./channelHandler');

module.exports = (server) => {
  const option = {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  };

  const io = socketIO(server, option);

  io.use((socket, next) => {
    if (socket.handshake.auth?.token) {
      const { token } = socket.handshake.auth;

      authenticateJwt(token, socket, next);
    } else {
      socket.disconnect();
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Channel handling.
    channelHandler(socket);

    // Messages handling.
    messageHandler(socket, io);
  });
};
