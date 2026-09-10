require('dotenv').config();

const base = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

module.exports = {
  development: {
    ...base,
    use_env_variable: 'DATABASE_URL'
  },
  test: {
    ...base,
    use_env_variable: 'DATABASE_URL'
  },
  production: {
    ...base,
    use_env_variable: 'DATABASE_URL'
  }
};
