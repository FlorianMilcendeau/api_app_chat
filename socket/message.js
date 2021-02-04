const { User, Message } = require('../models');

module.exports = async (socket, io) => {
  const { id: userId } = socket.user;

  // listen to incoming messages.
  socket.on('ADD_MESSAGE', async (data) => {
    const {
      channelId,
      content: { author, content, created_at },
    } = data;

    // Check User.
    if (userId === author.id) {
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
        author: { ...author, picture },
      });
    }
  });

  socket.on('DELETE_MESSAGE', async (data) => {
    const { channelId, messageId, authorId } = data;

    // Check User.
    if (userId === authorId) {
      await Message.destroy({ where: { id: messageId } });

      io.in(channelId).emit('UPDATE_MESSAGE', messageId);
    }
  });
};
