// Central model registry — sets up all Sequelize associations
const Usuario = require('./usuario.model');
const Entrenador = require('./entrenador.model');
const Sala = require('./sala.model');
const Servicio = require('./servicio.model');
const Plan = require('./plan.model');
const Suscripcion = require('./suscripcion.model');
const Horario = require('./horario.model');
const Reserva = require('./reserva.model');
const Pago = require('./pago.model');
const GastoEntrenador = require('./gasto_entrenador.model');

// Usuario <-> Entrenador
Usuario.hasOne(Entrenador, { foreignKey: 'usuario_id', as: 'perfilEntrenador' });
Entrenador.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Usuario <-> Suscripcion
Usuario.hasMany(Suscripcion, { foreignKey: 'usuario_id', as: 'suscripciones' });
Suscripcion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Plan <-> Suscripcion
Plan.hasMany(Suscripcion, { foreignKey: 'plan_id', as: 'suscripciones' });
Suscripcion.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });

// Horario associations
Servicio.hasMany(Horario, { foreignKey: 'servicio_id', as: 'horarios' });
Horario.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });

Sala.hasMany(Horario, { foreignKey: 'sala_id', as: 'horarios' });
Horario.belongsTo(Sala, { foreignKey: 'sala_id', as: 'sala' });

Entrenador.hasMany(Horario, { foreignKey: 'entrenador_id', as: 'horarios' });
Horario.belongsTo(Entrenador, { foreignKey: 'entrenador_id', as: 'entrenador' });

// Reserva associations
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Horario.hasMany(Reserva, { foreignKey: 'horario_id', as: 'reservas' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id', as: 'horario' });

// Pago associations
Usuario.hasMany(Pago, { foreignKey: 'usuario_id', as: 'pagos' });
Pago.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Suscripcion.hasMany(Pago, { foreignKey: 'suscripcion_id', as: 'pagos' });
Pago.belongsTo(Suscripcion, { foreignKey: 'suscripcion_id', as: 'suscripcion' });

// GastoEntrenador associations
Entrenador.hasMany(GastoEntrenador, { foreignKey: 'entrenador_id', as: 'gastos' });
GastoEntrenador.belongsTo(Entrenador, { foreignKey: 'entrenador_id', as: 'entrenador' });

module.exports = {
  Usuario,
  Entrenador,
  Sala,
  Servicio,
  Plan,
  Suscripcion,
  Horario,
  Reserva,
  Pago,
  GastoEntrenador
};
