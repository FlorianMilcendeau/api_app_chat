module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'channel',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false },
      description: { type: DataTypes.STRING(300), allowNull: true },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      tablename: 'channel',
      freezeTableName: true,
      timestamps: false,
    }
  );
