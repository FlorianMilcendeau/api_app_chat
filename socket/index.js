const socketIO = require('socket.io');

const { authenticateJwt } = require('../middlewares/socketMiddleware');
const { Message, User } = require('../models');

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

    // listen to incoming messages.
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

      // Sent the messages to the intended channel.
      io.in(data.channelId).emit('ADD_MESSAGE', {
        id,
        ...data.content,
        author: { ...author, ...picture },
      });
    });
  });
};
