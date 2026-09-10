const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const usuarioService = require('./services/usuario.service');
const entrenadorService = require('./services/entrenador.service');
const salaService = require('./services/sala.service');
const servicioService = require('./services/servicio.service');
const planService = require('./services/plan.service');
const suscripcionService = require('./services/suscripcion.service');
const horarioService = require('./services/horario.service');
const reservaService = require('./services/reserva.service');
const pagoService = require('./services/pago.service');

const schema = buildSchema(`
  # ── Tipos base ──────────────────────────────────────────────────────────
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
    rol: String!
    telefono: String
    fecha_nacimiento: String
    foto_perfil: String
    codigo_qr: String
    estado: String!
    createdAt: String
    updatedAt: String
  }

  type Entrenador {
    id: ID!
    usuario_id: Int!
    especialidades: String
    biografia: String
    certificaciones: String
    createdAt: String
    updatedAt: String
  }

  type Sala {
    id: ID!
    nombre: String!
    capacidad_maxima: Int!
    descripcion: String
    estado: String!
    createdAt: String
    updatedAt: String
  }

  type Servicio {
    id: ID!
    nombre: String!
    descripcion: String
    duracion_minutos: Int!
    estado: String!
    createdAt: String
    updatedAt: String
  }

  type Plan {
    id: ID!
    nombre: String!
    descripcion: String
    precio: Float!
    clases_por_mes: Int
    invitados_por_mes: Int!
    activo: Boolean!
    createdAt: String
    updatedAt: String
  }

  type Suscripcion {
    id: ID!
    usuario_id: Int!
    plan_id: Int!
    fecha_inicio: String!
    fecha_fin: String!
    estado: String!
    clases_usadas_mes: Int!
    pagado: Boolean!
    createdAt: String
    updatedAt: String
  }

  type Horario {
    id: ID!
    servicio_id: Int!
    sala_id: Int!
    entrenador_id: Int!
    dia_semana: Int!
    hora_inicio: String!
    hora_fin: String!
    cupo_maximo: Int!
    estado: String!
    createdAt: String
    updatedAt: String
  }

  type Reserva {
    id: ID!
    usuario_id: Int!
    horario_id: Int!
    fecha: String!
    estado: String!
    createdAt: String
    updatedAt: String
  }

  type Pago {
    id: ID!
    usuario_id: Int!
    suscripcion_id: Int
    concepto: String!
    monto: Float!
    metodo_pago: String!
    estado: String!
    fecha_pago: String
    createdAt: String
    updatedAt: String
  }

  # ── Inputs ───────────────────────────────────────────────────────────────
  input RegistrarUsuarioInput {
    nombre: String!
    email: String!
    password: String!
    rol: String
    telefono: String
    fecha_nacimiento: String
  }

  input ActualizarUsuarioInput {
    nombre: String
    email: String
    password: String
    telefono: String
    fecha_nacimiento: String
    foto_perfil: String
    estado: String
  }

  input EntrenadorInput {
    usuario_id: Int!
    especialidades: String
    biografia: String
    certificaciones: String
  }

  input ActualizarEntrenadorInput {
    especialidades: String
    biografia: String
    certificaciones: String
  }

  input SalaInput {
    nombre: String!
    capacidad_maxima: Int!
    descripcion: String
    estado: String
  }

  input ActualizarSalaInput {
    nombre: String
    capacidad_maxima: Int
    descripcion: String
    estado: String
  }

  input ServicioInput {
    nombre: String!
    descripcion: String
    duracion_minutos: Int
    estado: String
  }

  input ActualizarServicioInput {
    nombre: String
    descripcion: String
    duracion_minutos: Int
    estado: String
  }

  input PlanInput {
    nombre: String!
    descripcion: String
    precio: Float!
    clases_por_mes: Int
    invitados_por_mes: Int
    activo: Boolean
  }

  input ActualizarPlanInput {
    nombre: String
    descripcion: String
    precio: Float
    clases_por_mes: Int
    invitados_por_mes: Int
    activo: Boolean
  }

  input HorarioInput {
    servicio_id: Int!
    sala_id: Int!
    entrenador_id: Int!
    dia_semana: Int!
    hora_inicio: String!
    hora_fin: String!
    cupo_maximo: Int!
    estado: String
  }

  input ActualizarHorarioInput {
    servicio_id: Int
    sala_id: Int
    entrenador_id: Int
    dia_semana: Int
    hora_inicio: String
    hora_fin: String
    cupo_maximo: Int
    estado: String
  }

  input PagoInput {
    usuario_id: Int!
    suscripcion_id: Int
    concepto: String!
    monto: Float!
    metodo_pago: String!
  }

  # ── Queries ──────────────────────────────────────────────────────────────
  type Query {
    health: String!

    # Admin
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
    entrenadores: [Entrenador!]!
    entrenador(id: ID!): Entrenador
    salas: [Sala!]!
    sala(id: ID!): Sala
    servicios: [Servicio!]!
    servicio(id: ID!): Servicio
    planes: [Plan!]!
    plan(id: ID!): Plan
    suscripciones: [Suscripcion!]!
    suscripcion(id: ID!): Suscripcion
    horarios: [Horario!]!
    horario(id: ID!): Horario
    reservas: [Reserva!]!
    pagos: [Pago!]!

    # Cliente
    misReservas(usuario_id: Int!): [Reserva!]!
    miSuscripcion(usuario_id: Int!): Suscripcion
    horariosDisponibles(servicio_id: Int!): [Horario!]!
    misPagos(usuario_id: Int!): [Pago!]!

    # Entrenador
    misHorarios(entrenador_id: Int!): [Horario!]!
    reservasPorHorario(horario_id: Int!): [Reserva!]!
  }

  # ── Mutations ─────────────────────────────────────────────────────────────
  type Mutation {
    # Usuarios
    registrarme(input: RegistrarUsuarioInput!): Usuario!
    actualizarUsuario(id: ID!, input: ActualizarUsuarioInput!): Usuario
    eliminarUsuario(id: ID!): Usuario

    # Entrenadores (admin)
    crearEntrenador(input: EntrenadorInput!): Entrenador!
    actualizarEntrenador(id: ID!, input: ActualizarEntrenadorInput!): Entrenador
    eliminarEntrenador(id: ID!): Entrenador

    # Salas (admin)
    crearSala(input: SalaInput!): Sala!
    actualizarSala(id: ID!, input: ActualizarSalaInput!): Sala
    eliminarSala(id: ID!): Sala

    # Servicios (admin)
    crearServicio(input: ServicioInput!): Servicio!
    actualizarServicio(id: ID!, input: ActualizarServicioInput!): Servicio
    eliminarServicio(id: ID!): Servicio

    # Planes (admin)
    crearPlan(input: PlanInput!): Plan!
    actualizarPlan(id: ID!, input: ActualizarPlanInput!): Plan
    eliminarPlan(id: ID!): Plan

    # Suscripciones
    suscribirme(usuario_id: Int!, plan_id: Int!): Suscripcion!
    activarSuscripcion(suscripcion_id: Int!): Suscripcion!
    renovarSuscripcion(suscripcion_id: Int!): Suscripcion!

    # Horarios (admin)
    crearHorario(input: HorarioInput!): Horario!
    actualizarHorario(id: ID!, input: ActualizarHorarioInput!): Horario
    eliminarHorario(id: ID!): Horario

    # Reservas
    crearReserva(usuario_id: Int!, horario_id: Int!, fecha: String!): Reserva!
    cancelarReserva(reserva_id: Int!, usuario_id: Int!): Reserva!
    marcarAsistencia(reserva_id: Int!): Reserva!

    # Pagos (admin)
    registrarPago(input: PagoInput!): Pago!
  }
`);

const root = {
  health: () => 'API Cuspian Studio activa ✓',

  // ── Usuarios ──
  usuarios: () => usuarioService.listarUsuarios(),
  usuario: ({ id }) => usuarioService.obtenerUsuarioPorId(id),
  registrarme: ({ input }) => usuarioService.registrarUsuario(input),
  actualizarUsuario: ({ id, input }) => usuarioService.actualizarUsuario(id, input),
  eliminarUsuario: ({ id }) => usuarioService.eliminarUsuario(id),

  // ── Entrenadores ──
  entrenadores: () => entrenadorService.listarEntrenadores(),
  entrenador: ({ id }) => entrenadorService.obtenerEntrenadorPorId(id),
  crearEntrenador: ({ input }) => entrenadorService.crearEntrenador(input),
  actualizarEntrenador: ({ id, input }) => entrenadorService.actualizarEntrenador(id, input),
  eliminarEntrenador: ({ id }) => entrenadorService.eliminarEntrenador(id),

  // ── Salas ──
  salas: () => salaService.listarSalas(),
  sala: ({ id }) => salaService.obtenerSalaPorId(id),
  crearSala: ({ input }) => salaService.crearSala(input),
  actualizarSala: ({ id, input }) => salaService.actualizarSala(id, input),
  eliminarSala: ({ id }) => salaService.eliminarSala(id),

  // ── Servicios ──
  servicios: () => servicioService.listarServicios(),
  servicio: ({ id }) => servicioService.obtenerServicioPorId(id),
  crearServicio: ({ input }) => servicioService.crearServicio(input),
  actualizarServicio: ({ id, input }) => servicioService.actualizarServicio(id, input),
  eliminarServicio: ({ id }) => servicioService.eliminarServicio(id),

  // ── Planes ──
  planes: () => planService.listarPlanes(),
  plan: ({ id }) => planService.obtenerPlanPorId(id),
  crearPlan: ({ input }) => planService.crearPlan(input),
  actualizarPlan: ({ id, input }) => planService.actualizarPlan(id, input),
  eliminarPlan: ({ id }) => planService.eliminarPlan(id),

  // ── Suscripciones ──
  suscripciones: () => suscripcionService.listarSuscripciones(),
  suscripcion: ({ id }) => suscripcionService.obtenerSuscripcionPorId(id),
  miSuscripcion: ({ usuario_id }) => suscripcionService.miSuscripcion(usuario_id),
  suscribirme: ({ usuario_id, plan_id }) => suscripcionService.suscribir(usuario_id, plan_id),
  activarSuscripcion: ({ suscripcion_id }) => suscripcionService.activarSuscripcion(suscripcion_id),
  renovarSuscripcion: ({ suscripcion_id }) => suscripcionService.renovarSuscripcion(suscripcion_id),

  // ── Horarios ──
  horarios: () => horarioService.listarHorarios(),
  horario: ({ id }) => horarioService.obtenerHorarioPorId(id),
  horariosDisponibles: ({ servicio_id }) => horarioService.horariosDisponiblesPorServicio(servicio_id),
  misHorarios: ({ entrenador_id }) => horarioService.listarHorarios().then((h) => h.filter((x) => x.entrenador_id === entrenador_id)),
  crearHorario: ({ input }) => horarioService.crearHorario(input),
  actualizarHorario: ({ id, input }) => horarioService.actualizarHorario(id, input),
  eliminarHorario: ({ id }) => horarioService.eliminarHorario(id),

  // ── Reservas ──
  reservas: () => reservaService.listarReservas(),
  misReservas: ({ usuario_id }) => reservaService.misReservas(usuario_id),
  reservasPorHorario: ({ horario_id }) => reservaService.reservasPorHorario(horario_id),
  crearReserva: ({ usuario_id, horario_id, fecha }) => reservaService.crearReserva(usuario_id, horario_id, fecha),
  cancelarReserva: ({ reserva_id, usuario_id }) => reservaService.cancelarReserva(reserva_id, usuario_id),
  marcarAsistencia: ({ reserva_id }) => reservaService.marcarAsistencia(reserva_id),

  // ── Pagos ──
  pagos: () => pagoService.listarPagos(),
  misPagos: ({ usuario_id }) => pagoService.misPagos(usuario_id),
  registrarPago: ({ input }) => pagoService.registrarPago(input)
};

module.exports = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
  customFormatErrorFn: (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path
  })
});
