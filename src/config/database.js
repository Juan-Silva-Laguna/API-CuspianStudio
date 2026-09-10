const { Sequelize } = require('sequelize');
const { env } = require('./env');

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function connectDatabase() {
  await sequelize.authenticate();
}

module.exports = {
  sequelize,
  connectDatabase
};
