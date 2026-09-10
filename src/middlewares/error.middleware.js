function notFoundHandler(req, res) {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
}

function errorHandler(error, req, res, next) {
  if (error.name && error.name.includes('Sequelize')) {
    return res.status(400).json({
      mensaje: 'Error de validacion o base de datos',
      detalle: error.message
    });
  }

  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
