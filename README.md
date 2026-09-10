# Politécnico Grancolombiano

**Maestría en Arquitectura de Software**
**Segundo Semestre**

**Primer Bloque - Virtual / Arquitectura de Aplicaciones Web - [Grupo K01]**

## Trabajo: Backend con servicios GraphQL

CRUD sobre base de datos usando GraphQL y Node.js

**Módulo:** Arquitectura de Aplicaciones Web
**Unidad:** 4

### Integrantes
- Valentina Orjuela Ordóñez
- Juan Ignacio Silva Laguna

### Tutor / Profesor
Wilson Eduardo Soto Forero

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

