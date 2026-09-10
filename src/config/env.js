require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL
};

function validateEnv() {
  if (!env.databaseUrl) {
    throw new Error('Falta la variable de entorno DATABASE_URL.');
  }
}

module.exports = {
  env,
  validateEnv
};
