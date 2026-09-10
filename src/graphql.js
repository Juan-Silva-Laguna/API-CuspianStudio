const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const productoService = require('./services/producto.service');

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

const root = {
  productos: async () => productoService.listarProductos(),
  producto: async ({ id }) => productoService.obtenerProductoPorId(id),
  health: () => 'API GraphQL de productos activa',
  crearProducto: async ({ input }) => productoService.crearProducto(input),
  actualizarProducto: async ({ id, input }) => productoService.actualizarProducto(id, input),
  eliminarProducto: async ({ id }) => productoService.eliminarProducto(id)
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
