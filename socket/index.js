const socketIO = require('socket.io');

const { authenticateJwt } = require('../middlewares/socketMiddleware');
const controllerMessage = require('./message');

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
    // Listen if anyone joins the channel.
    socket.on('JOIN_ROOM', (room) => {
      if (!socket.rooms.has(room)) {
        socket.join(room);
      }
    });

    // Messages controller.
    controllerMessage(socket, io);
  });
};
