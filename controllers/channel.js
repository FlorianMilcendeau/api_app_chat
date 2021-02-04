const router = require('express').Router();
const { Op } = require('sequelize');
const _ = require('lodash');

const checkToken = require('../middlewares/checkToken');
const { Channel, Member, User, Message } = require('../models');

router.get('/', checkToken, async (req, res) => {
  const { sub: id } = req.user;

  try {
    // Find all user's channels.
    const channels = await Channel.findAll({
      raw: true,
      include: {
        model: Member,
        required: true,
        attributes: ['role'],
        include: { model: User, attributes: [], where: { id } },
      },
    });

    const idChannels = channels.map((channel) => ({ channel_id: channel.id }));

    // Find all channel's members.
    const members = await User.findAll({
      raw: true,
      attributes: ['id', 'name', 'picture'],
      include: {
        model: Member,
        required: true,
        attributes: ['channel_id'],
        where: { [Op.or]: idChannels },
      },
    });

    // Grouping all members by channel.
    const grouped = _.mapValues(
      _.groupBy(members, 'members.channel_id'),
      (clist) => clist.map((m) => _.omit(m, ['members.channel_id']))
    );

    // Assign all channels own members.
    const allChannel = channels.map((channel) => {
      let result;
      _.forIn(grouped, (value, key) => {
        if (channel.id === parseInt(key, 10)) {
          result = Object.assign(channel, { members: value });
        }
      });

      return result;
    });

    res.status(200).json(allChannel);
  } catch (error) {
    res.status(500).json(error);
  }
});

/** Get channel's message */
router.get('/:id/messages', checkToken, async (req, res) => {
  const { id } = req.params;

  const messageFound = await Message.findAll({
    raw: true,
    attributes: ['id', 'content', 'created_at'],
    include: [
      {
        model: Channel,
        attributes: [],
        where: { id },
      },
      { model: User, attributes: ['id', 'name', 'picture'] },
    ],
  });

  if (!messageFound.length > 0) {
    return res.status(204).json({ message: 'No message yet' });
  }

  const messages = messageFound.map(
    ({ id: idMessage, content, created_at, ...message }) => ({
      id: idMessage,
      author: {
        id: message['user.id'],
        name: message['user.name'],
        picture: message['user.picture'],
      },
      content,
      created_at,
    })
  );

  return res.status(200).json(messages);
});

module.exports = router;
