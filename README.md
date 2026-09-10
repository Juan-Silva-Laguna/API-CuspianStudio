# API Cuspian Studio

**Backend GraphQL — Sistema de gestión para estudio de movimiento**

Cuspian Studio es un estudio de movimiento que ofrece clases de Dance Fitness, Yoga, Salsa, Jumping, Funcional, Pilates, Urbano, Stretching y Bienestar. Esta API gestiona los tres roles del sistema: **Admin**, **Cliente** y **Entrenador**.

---

## Tecnologías

- Node.js + Express
- GraphQL (`express-graphql`)
- Sequelize ORM + PostgreSQL
- bcryptjs (contraseñas)

---

## Roles del sistema

| Rol | Descripción |
|---|---|
| `admin` | Gestión completa: salas, servicios, planes, entrenadores, horarios, pagos |
| `cliente` | Registro, suscripción a planes, reserva de clases |
| `entrenador` | Consulta de sus horarios y asistentes |

---

## Entidades y base de datos

### `usuarios`
Todos los usuarios del sistema. Campos: `nombre`, `email`, `password` (hash), `telefono`, `fecha_nacimiento`, `foto_perfil`, `codigo_qr`, `rol` (admin/cliente/entrenador), `estado` (activo/inactivo).

### `entrenadores`
Perfil extendido de un usuario con rol `entrenador`. Campos: `usuario_id`, `especialidades`, `biografia`, `certificaciones`.

### `salas`
Espacios físicos del estudio. Campos: `nombre`, `capacidad_maxima`, `descripcion`, `estado` (activa/inactiva).

### `servicios`
Tipos de clase ofrecidos. Campos: `nombre` (ej. SALSA, YOGA), `descripcion`, `duracion_minutos`, `estado`.

### `planes`
Membresías disponibles. Campos: `nombre`, `precio`, `clases_por_mes` (null = ilimitado), `invitados_por_mes`, `activo`.

**Planes actuales:**
| Plan | Clases/mes | Precio |
|---|---|---|
| Plan Inicial | 8 | $80.000 |
| Plan Activo | 12 | $100.000 |
| Plan Full | ilimitado | $150.000 |
| Plan Cuspian VIP | ilimitado | $170.000 |

### `suscripciones`
Vincula cliente con plan. Campos: `usuario_id`, `plan_id`, `fecha_inicio`, `fecha_fin`, `estado` (activa/inactiva/vencida), `clases_usadas_mes`, `pagado`.

### `horarios`
Programación de clases. Campos: `servicio_id`, `sala_id`, `entrenador_id`, `dia_semana` (0=Dom … 6=Sáb), `hora_inicio`, `hora_fin`, `cupo_maximo`, `estado`.

### `reservas`
Agendamiento de un cliente a un horario en una fecha específica. Campos: `usuario_id`, `horario_id`, `fecha`, `estado` (confirmada/cancelada/asistio).

### `pagos`
Registro de transacciones. Campos: `usuario_id`, `suscripcion_id`, `concepto`, `monto`, `metodo_pago`, `estado`, `fecha_pago`.

---

## Reglas de negocio

Al crear una reserva se validan en orden:
1. El cliente tiene suscripción activa y pagada.
2. Si el plan tiene límite de clases, no ha superado el cupo mensual.
3. El horario existe y está activo.
4. La sala no está llena (`reservas_confirmadas < cupo_maximo`).
5. El cliente no tiene ya una reserva confirmada en ese horario/fecha.

Al registrar un pago vinculado a una suscripción, la suscripción se activa automáticamente.

---

## Instalación

```bash
npm install
cp .env.example .env
# Configurar DATABASE_URL en .env
npm run migrate
npm run dev
```

---

## GraphQL endpoint

`POST /graphql` — También disponible en modo interactivo en `GET /graphql` (GraphiQL).

### Queries principales

```graphql
# Salud de la API
{ health }

# Listar planes disponibles
{ planes { id nombre precio clases_por_mes } }

# Listar horarios de un servicio
{ horariosDisponibles(servicio_id: 1) { id dia_semana hora_inicio hora_fin cupo_maximo } }

# Mis reservas
{ misReservas(usuario_id: 5) { id fecha estado } }

# Mi suscripción activa
{ miSuscripcion(usuario_id: 5) { estado clases_usadas_mes } }
```

### Mutations principales

```graphql
# Registrar cliente
mutation {
  registrarme(input: {
    nombre: "Ana López"
    email: "ana@email.com"
    password: "segura123"
  }) { id codigo_qr }
}

# Suscribirse a un plan
mutation { suscribirme(usuario_id: 5, plan_id: 2) { id fecha_fin } }

# Registrar pago (activa suscripción)
mutation {
  registrarPago(input: {
    usuario_id: 5, suscripcion_id: 3
    concepto: "Plan Activo - Septiembre"
    monto: 100000, metodo_pago: "transferencia"
  }) { id estado }
}

# Crear reserva
mutation {
  crearReserva(usuario_id: 5, horario_id: 2, fecha: "2026-09-15") {
    id fecha estado
  }
}

# Cancelar reserva
mutation { cancelarReserva(reserva_id: 7, usuario_id: 5) { id estado } }

# Admin: crear sala
mutation {
  crearSala(input: { nombre: "Sala Principal", capacidad_maxima: 20 }) { id }
}

# Admin: crear horario
mutation {
  crearHorario(input: {
    servicio_id: 1, sala_id: 1, entrenador_id: 1
    dia_semana: 1, hora_inicio: "07:00", hora_fin: "08:00", cupo_maximo: 15
  }) { id }
}
```

---

## Variables de entorno

```env
DATABASE_URL=******host:5432/cuspian_studio
PORT=4000
```

---

# API GraphQL de Productos

Desarrollé este backend en Node.js con Express, Sequelize y GraphQL para gestionar productos sobre PostgreSQL.

La diferencia principal con una arquitectura de consultas tradicionales es que el cliente define exactamente la información que necesita y el servidor responde con un único payload estructurado, evitando sobrecarga de datos y reduciendo el número de llamadas.

## Arquitectura aplicada

Implementé una estructura por capas para mantener el proyecto ordenado y escalable:

- En Config centralizo entorno y conexión con PostgreSQL.
- En Modelos defino la entidad ORM.
- En Repositorios encapsulo el acceso a datos con Sequelize.
- En Servicios implemento la lógica de negocio.
- En GraphQL defino el esquema, tipos, querys y mutaciones.
- En Middlewares gestiono errores y comportamiento transversal.
- En App/Server compongo la aplicación y su arranque.

## Enfoque de GraphQL

GraphQL permite definir un contrato fuerte entre cliente y servidor mediante tipos y campos. En este proyecto, la API expone operaciones como:

- Querys para consultar productos
- Mutaciones para crear, actualizar y eliminar productos
- Un solo endpoint GraphQL para todos los casos
- Un esquema explícito para cada campo y su estructura

Esto hace que el consumo sea más flexible, porque el frontend puede pedir solo los atributos que necesita sin depender de múltiples rutas o endpoints.

## Estructura de carpetas y archivos

```text
API GraphQL/
├─ index.js
├─ package.json
├─ .sequelizerc
├─ .env
├─ config/
│  └─ config.js
├─ migrations/
│  └─ 20260819000000-create-productos.js
├─ seeders/
│  └─ 20260821000000-demo-productos.js
└─ src/
   ├─ app.js
   ├─ graphql.js
   ├─ server.js
   ├─ config/
   │  ├─ env.js
   │  └─ database.js
   ├─ models/
   │  └─ producto.model.js
   ├─ repositories/
   │  └─ producto.repository.js
   ├─ services/
   │  └─ producto.service.js
   ├─ middlewares/
   │  └─ error.middleware.js
   └─ graphql/
      └─ schema.js
```

## Requisitos

- Node.js 18 o superior
- PostgreSQL con una base de datos activa
- Conexión configurada en variable de entorno

## Instalación de dependencias

Se instalan las bibliotecas base para crear la API con Express y GraphQL:

```bash
npm init -y
npm install express sequelize pg pg-hstore dotenv helmet cors graphql express-graphql
npm install -D sequelize-cli
```

### Explicación de cada librería

- express: crea el servidor HTTP principal
- sequelize: ORM para interactuar con PostgreSQL
- pg: driver de PostgreSQL
- pg-hstore: soporte para serialización de tipos en Sequelize
- dotenv: carga variables de entorno
- helmet: seguridad para cabeceras HTTP
- cors: permite consumo desde otros orígenes
- graphql: motor de GraphQL
- express-graphql: integración de GraphQL con Express
- sequelize-cli: permite crear y administrar migraciones

## Configuración paso a paso

### 1. Crear el archivo .env

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
```

### 2. Configurar variables de entorno

Se define un archivo de configuración para leer `PORT` y `DATABASE_URL`:

```js
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
```

Esto permite separar la configuración del código y evitar hardcodear credenciales.

### 3. Conectar Sequelize con PostgreSQL

```js
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
```

### 4. Definir el modelo Producto

```js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    }
  },
  {
    tableName: 'productos',
    timestamps: true
  }
);

module.exports = Producto;
```

### 5. Crear el esquema GraphQL

El esquema es el centro de la API. Define los tipos, inputs y operaciones que el cliente puede consumir.

```js
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Producto {
    id: ID!
    nombre: String!
    descripcion: String!
    precio: Float!
    createdAt: String
    updatedAt: String
  }

  input ProductoInput {
    nombre: String!
    descripcion: String!
    precio: Float!
  }

  type Query {
    productos: [Producto!]!
    producto(id: ID!): Producto
    health: String!
  }

  type Mutation {
    crearProducto(input: ProductoInput!): Producto!
    actualizarProducto(id: ID!, input: ProductoInput!): Producto
    eliminarProducto(id: ID!): Producto
  }
`);
```

### 6. Conectar el esquema con Express

```js
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/graphql', graphqlMiddleware);
app.get('/health', (req, res) => {
  res.json({ mensaje: 'API GraphQL de productos activa' });
});
```

Este paso es clave porque GraphQL se monta como middleware dentro de Express y queda disponible en un único endpoint: `/graphql`.

### 7. Definir resolvers

Los resolvers conectan el esquema con la lógica de negocio.

```js
const productoService = require('./services/producto.service');

const root = {
  productos: async () => productoService.listarProductos(),
  producto: async ({ id }) => productoService.obtenerProductoPorId(id),
  health: () => 'API GraphQL de productos activa',
  crearProducto: async ({ input }) => productoService.crearProducto(input),
  actualizarProducto: async ({ id, input }) => productoService.actualizarProducto(id, input),
  eliminarProducto: async ({ id }) => productoService.eliminarProducto(id)
};
```

## Comandos útiles del proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar el proyecto en modo desarrollo
npm run dev

# Ejecutar el proyecto en modo normal
npm start

# Aplicar migraciones
npm run migrate

# Ver estado de migraciones
npm run migrate:status

# Revertir última migración
npm run migrate:undo

# Revertir todas las migraciones
npm run migrate:undo:all

# Crear una migración nueva
npm run migration:create -- nombre-migracion

# Insertar datos de prueba
npm run seed
```

## Flujo de trabajo de esta API GraphQL

1. Se levanta el servidor Express.
2. Se valida la conexión con PostgreSQL.
3. Se monta el middleware GraphQL en `/graphql`.
4. El cliente envía una consulta o mutación en JSON.
5. GraphQL resuelve el esquema y ejecuta el resolver correcto.
6. El servicio llama al repositorio.
7. El repositorio usa Sequelize para consultar o modificar la base de datos.
8. La respuesta regresa en formato JSON estructurado según el esquema.

## Crear la tabla con migraciones

Este proyecto usa migraciones versionadas para crear y mantener la base de datos:

```bash
npm run migrate
```

La migración define la tabla `productos` con los campos:
- id
- nombre
- descripcion
- precio
- createdAt
- updatedAt

## Consultas GraphQL

### Consulta de salud

```graphql
{
  health
}
```

### Listar productos

```graphql
{
  productos {
    id
    nombre
    descripcion
    precio
  }
}
```

### Obtener un producto por id

```graphql
{
  producto(id: 1) {
    id
    nombre
    descripcion
    precio
  }
}
```

## Mutaciones GraphQL

### Crear producto

```graphql
mutation {
  crearProducto(input: {
    nombre: "Mouse Gamer"
    descripcion: "Mouse RGB de 6 botones"
    precio: 29.99
  }) {
    id
    nombre
    descripcion
    precio
  }
}
```

### Actualizar producto

```graphql
mutation {
  actualizarProducto(id: 1, input: {
    nombre: "Teclado mecánico"
    descripcion: "Teclado gaming con switches rojos"
    precio: 79.99
  }) {
    id
    nombre
    descripcion
    precio
  }
}
```

### Eliminar producto

```graphql
mutation {
  eliminarProducto(id: 1) {
    id
    nombre
  }
}
```

## Seguridad aplicada

Se incorporaron medidas básicas para mejorar la robustez del backend:

- helmet para reforzar cabeceras HTTP
- cors para controlar acceso desde otros orígenes
- validación de variables de entorno
- manejo centralizado de errores

## Instalación final

```bash
npm install
```

## Ejecución final

```bash
npm run dev
```

o

```bash
npm start
```

## Resultado esperado

La aplicación queda disponible en:

```text
http://localhost:3000/graphql
```

Desde allí puedes ejecutar consultas y mutaciones GraphQL con una interfaz visual si usas GraphiQL.

## Conclusión

GraphQL mejora mucho la forma en que se consume la API porque la estructura de la respuesta depende de lo que el cliente solicita. En un proyecto real, esto permite optimizar el rendimiento, reducir llamadas y crear un contrato más claro entre frontend y backend.

