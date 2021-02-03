const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequilize');

const User = require('./user')(sequelize, DataTypes);
const Channel = require('./channel')(sequelize, DataTypes);
const Member = require('./member')(sequelize, DataTypes);
const Message = require('./message')(sequelize, DataTypes);

Channel.hasMany(Member);
Member.belongsTo(Channel);

Channel.hasMany(Message);
Message.belongsTo(Channel);

User.hasMany(Member);
Member.belongsTo(User);

User.hasMany(Message);
Message.belongsTo(User);

module.exports.User = User;
module.exports.Channel = Channel;
module.exports.Member = Member;
module.exports.Message = Message;
