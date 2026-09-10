const app = require('./app');
const { env, validateEnv } = require('./config/env');
const { connectDatabase } = require('./config/database');

async function startServer() {
  try {
    validateEnv();
    await connectDatabase();

    console.log('Conexion a PostgreSQL establecida correctamente.');
    app.listen(env.port, () => {
      console.log(`Servidor corriendo en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
}

module.exports = {
  startServer
};
