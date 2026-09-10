const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const productoService = require('./services/producto.service');
const usuarioService = require('./services/usuario.service');

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

  type Usuario {
    id: ID!
    nombre: String!
    email: String!
    rol: String!
    createdAt: String
    updatedAt: String
  }

  input UsuarioInput {
    nombre: String!
    email: String!
    password: String!
    rol: String
  }

  input ActualizarUsuarioInput {
    nombre: String
    email: String
    password: String
    rol: String
  }

  type Query {
    productos: [Producto!]!
    producto(id: ID!): Producto
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
    health: String!
  }

  type Mutation {
    crearProducto(input: ProductoInput!): Producto!
    actualizarProducto(id: ID!, input: ProductoInput!): Producto
    eliminarProducto(id: ID!): Producto
    crearUsuario(input: UsuarioInput!): Usuario!
    actualizarUsuario(id: ID!, input: ActualizarUsuarioInput!): Usuario
    eliminarUsuario(id: ID!): Usuario
  }
`);

const root = {
  productos: async () => productoService.listarProductos(),
  producto: async ({ id }) => productoService.obtenerProductoPorId(id),
  health: () => 'API GraphQL activa',
  crearProducto: async ({ input }) => productoService.crearProducto(input),
  actualizarProducto: async ({ id, input }) => productoService.actualizarProducto(id, input),
  eliminarProducto: async ({ id }) => productoService.eliminarProducto(id),
  usuarios: async () => usuarioService.listarUsuarios(),
  usuario: async ({ id }) => usuarioService.obtenerUsuarioPorId(id),
  crearUsuario: async ({ input }) => usuarioService.crearUsuario(input),
  actualizarUsuario: async ({ id, input }) => usuarioService.actualizarUsuario(id, input),
  eliminarUsuario: async ({ id }) => usuarioService.eliminarUsuario(id)
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
