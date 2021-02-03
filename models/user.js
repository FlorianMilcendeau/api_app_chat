module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'user',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false },
      email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      bio: { type: DataTypes.TEXT, allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      picture: { type: DataTypes.STRING(300), allowNull: true },
      is_admin: { type: DataTypes.BOOLEAN, defaultValue: 0 },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      tablename: 'user',
      freezeTableName: true,
      timestamps: false,
    }
  );
