const { Channel, Member, User } = require('../models');

module.exports = async (socket) => {
  /* const { id } = socket.user;

  console.log(User);
  const allChannel = await Channel.findAll({
    raw: true,
    include: {
      model: Member,
      attributes: ['role'],
      include: { model: User, attributes: [], where: { id } },
    },
  });

  console.log(allChannel);
  socket.emit('channels', allChannel); */
};
