const gastoRepository = require('../repositories/gasto_entrenador.repository');
const entrenadorRepository = require('../repositories/entrenador.repository');

async function registrarGastoEntrenador(payload) {
  const { entrenador_id, concepto, monto, metodo_pago, notas } = payload;
  const entrenador = await entrenadorRepository.findById(entrenador_id);
  if (!entrenador) throw new Error('Entrenador no encontrado.');
  return gastoRepository.create({
    entrenador_id,
    concepto,
    monto,
    metodo_pago: metodo_pago || 'efectivo',
    fecha_pago: new Date(),
    notas: notas || null
  });
}

async function listarGastos() {
  return gastoRepository.findAll();
}

async function gastosPorEntrenador(entrenador_id) {
  return gastoRepository.findByEntrenadorId(entrenador_id);
}

async function acumuladoPorEntrenador(entrenador_id) {
  return gastoRepository.sumByEntrenadorId(entrenador_id);
}

module.exports = {
  registrarGastoEntrenador,
  listarGastos,
  gastosPorEntrenador,
  acumuladoPorEntrenador
};
