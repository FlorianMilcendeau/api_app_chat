const Squelize = require('sequelize');

const squelize = new Squelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    loggin: false,
  }
);

(async () => {
  try {
    await squelize.authenticate();

    console.log(
      'Connection to the database has been established successfully.'
    );
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();

module.exports = squelize;
