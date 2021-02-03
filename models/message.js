module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'message',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      channel_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      tablename: 'message',
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
