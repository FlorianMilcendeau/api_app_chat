const socketIO = require('socket.io');

const { authenticateJwt } = require('../middlewares/socketMiddleware');
const { Message, User } = require('../models');

module.exports = (server) => {
  const option = {
    cors: {
      origin: 'http://localhost:3000',
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
    console.log(`new connection of ${socket.user.name}`);

    socket.on('JOIN_ROOM', (room) => {
      if (!socket.rooms.has(room)) {
        socket.join(room);
      }
    });

    socket.on('ADD_MESSAGE', async (data) => {
      const {
        channelId,
        content: { author, content, created_at },
      } = data;

      const message = await Message.create({
        channel_id: channelId,
        user_id: author.id,
        content,
        created_at,
      });

      const { picture } = await User.findByPk(author.id);

      const { id } = message.dataValues;

      io.in(data.channelId).emit('ADD_MESSAGE', {
        id,
        content: { ...content, ...picture },
      });
    });
  });
};
