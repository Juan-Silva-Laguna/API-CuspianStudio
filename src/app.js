const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const graphqlMiddleware = require('./graphql');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

// Load models and associations
require('./models');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlMiddleware);
app.get('/health', (req, res) => {
  res.json({ mensaje: 'API Cuspian Studio activa' });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
