module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'member',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      role: { type: DataTypes.STRING(30), allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tablename: 'member',
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
