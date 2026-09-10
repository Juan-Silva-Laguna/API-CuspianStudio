# Guia para probar la API GraphQL

Esta guia explica como probar la API de productos paso a paso. No es necesario haber usado GraphQL antes.

## 1. Que es GraphQL en este proyecto

La API tiene un unico endpoint para las operaciones GraphQL:

```text
http://localhost:3000/graphql
```

En lugar de tener una URL diferente para listar, crear, actualizar o eliminar productos, todas las operaciones se envian a esa ruta. La operacion que se quiere ejecutar se escribe dentro del cuerpo de la peticion.

La API permite estas operaciones:

- `health`: comprueba que GraphQL esta activo.
- `productos`: lista todos los productos.
- `producto`: busca un producto por su identificador.
- `crearProducto`: crea un producto.
- `actualizarProducto`: modifica un producto existente.
- `eliminarProducto`: elimina un producto.

## 2. Preparar el proyecto

Antes de probar las peticiones, verifica lo siguiente:

1. PostgreSQL o Supabase esta disponible.
2. El archivo `.env` tiene una `DATABASE_URL` valida.
3. Las migraciones fueron ejecutadas.
4. El servidor esta iniciado.

Comandos recomendados:

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

Tambien puedes iniciar el servidor sin modo de desarrollo:

```bash
npm start
```

Si todo funciona correctamente, deberias ver un mensaje parecido a:

```text
Servidor corriendo en http://localhost:3000
```

> Si tu variable `PORT` usa otro puerto, reemplaza `3000` en todos los ejemplos de esta guia.

## 3. Primera comprobacion: endpoint de salud

Antes de probar GraphQL, abre esta direccion en el navegador:

```text
http://localhost:3000/health
```

La respuesta esperada es similar a:

```json
{
  "mensaje": "API GraphQL de productos activa"
}
```

Esta ruta no es una consulta GraphQL; sirve para comprobar rapidamente que el servidor Express esta encendido.

## 4. Probar con GraphiQL

El proyecto tiene GraphiQL habilitado, que es una interfaz web para escribir y ejecutar consultas GraphQL.

1. Abre `http://localhost:3000/graphql` en el navegador.
2. Escribe una consulta en el panel izquierdo.
3. Presiona el boton de ejecutar.
4. Observa la respuesta en el panel derecho.

GraphiQL permite consultar el esquema y muestra autocompletado. Si aparece una documentacion lateral, puedes abrirla para revisar los tipos y campos disponibles.

## 5. Estructura basica de una peticion

Una consulta GraphQL tiene esta forma:

```graphql
query {
  nombreDeLaOperacion {
    campo1
    campo2
  }
}
```

Los campos que aparecen entre llaves indican exactamente los datos que se quieren recibir. Por ejemplo, esta consulta solicita solamente tres campos de cada producto:

```graphql
query {
  productos {
    id
    nombre
    precio
  }
}
```

Una mutacion se escribe de forma parecida, pero se utiliza la palabra `mutation` porque cambia los datos:

```graphql
mutation {
  crearProducto(input: {
    nombre: "Teclado"
    descripcion: "Teclado mecanico USB"
    precio: 150000
  }) {
    id
    nombre
    precio
  }
}
```

## 6. Pruebas recomendadas en orden

### Prueba 1: consultar la salud de GraphQL

En GraphiQL, ejecuta:

```graphql
query {
  health
}
```

Respuesta esperada:

```json
{
  "data": {
    "health": "API GraphQL de productos activa"
  }
}
```

### Prueba 2: listar productos

```graphql
query {
  productos {
    id
    nombre
    descripcion
    precio
    createdAt
    updatedAt
  }
}
```

Al principio puedes recibir una lista vacia. Si ejecutaste el seeder, deberias recibir los productos de ejemplo.

Tambien puedes pedir solo algunos campos:

```graphql
query {
  productos {
    nombre
    precio
  }
}
```

Esta es una de las ventajas de GraphQL: el cliente decide los campos que necesita.

### Prueba 3: buscar un producto por ID

Usa un ID que exista en la respuesta de la prueba anterior:

```graphql
query {
  producto(id: "1") {
    id
    nombre
    descripcion
    precio
  }
}
```

Si no existe un producto con ese ID, la respuesta sera:

```json
{
  "data": {
    "producto": null
  }
}
```

### Prueba 4: crear un producto

```graphql
mutation {
  crearProducto(input: {
    nombre: "Mouse inalambrico"
    descripcion: "Mouse ergonomico con conexion Bluetooth"
    precio: 89000
  }) {
    id
    nombre
    descripcion
    precio
    createdAt
    updatedAt
  }
}
```

Guarda el `id` que devuelve la respuesta. Lo necesitaras para actualizar y eliminar este mismo producto.

Una respuesta exitosa tendra una estructura parecida a esta:

```json
{
  "data": {
    "crearProducto": {
      "id": "4",
      "nombre": "Mouse inalambrico",
      "descripcion": "Mouse ergonomico con conexion Bluetooth",
      "precio": 89000,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

El ID exacto y las fechas dependen del estado de la base de datos.

### Prueba 5: actualizar un producto

Reemplaza `4` por el ID que recibiste al crearlo:

```graphql
mutation {
  actualizarProducto(
    id: "4"
    input: {
      nombre: "Mouse inalambrico actualizado"
      descripcion: "Mouse ergonomico Bluetooth con bateria recargable"
      precio: 95000
    }
  ) {
    id
    nombre
    descripcion
    precio
    updatedAt
  }
}
```

Comprueba que el nombre, la descripcion y el precio hayan cambiado.

### Prueba 6: confirmar el cambio

```graphql
query {
  producto(id: "4") {
    id
    nombre
    descripcion
    precio
  }
}
```

Esta consulta confirma el estado guardado en la base de datos, no solamente el objeto devuelto por la mutacion.

### Prueba 7: eliminar un producto

Usa el ID del producto creado para esta guia:

```graphql
mutation {
  eliminarProducto(id: "4") {
    id
    nombre
    descripcion
    precio
  }
}
```

La mutacion devuelve el producto eliminado. Si el ID no existe, puede devolver `null`.

### Prueba 8: confirmar la eliminacion

```graphql
query {
  producto(id: "4") {
    id
    nombre
  }
}
```

La respuesta esperada es:

```json
{
  "data": {
    "producto": null
  }
}
```

## 7. Usar variables GraphQL

Las variables permiten separar la consulta de los valores. Es una forma mas segura y ordenada de enviar datos, especialmente desde una aplicacion frontend.

En GraphiQL escribe esta consulta:

```graphql
mutation CrearProducto($input: ProductoInput!) {
  crearProducto(input: $input) {
    id
    nombre
    descripcion
    precio
  }
}
```

En el panel de variables, normalmente ubicado en la parte inferior, escribe este JSON:

```json
{
  "input": {
    "nombre": "Camara web",
    "descripcion": "Camara web Full HD para videollamadas",
    "precio": 220000
  }
}
```

La declaracion `$input: ProductoInput!` indica que la variable es obligatoria y debe cumplir la estructura definida por el esquema.

Tambien puedes usar variables para buscar, actualizar y eliminar:

```graphql
query BuscarProducto($id: ID!) {
  producto(id: $id) {
    id
    nombre
    precio
  }
}
```

Variables:

```json
{
  "id": "1"
}
```

Para actualizar:

```graphql
mutation ActualizarProducto($id: ID!, $input: ProductoInput!) {
  actualizarProducto(id: $id, input: $input) {
    id
    nombre
    descripcion
    precio
  }
}
```

Variables:

```json
{
  "id": "1",
  "input": {
    "nombre": "Producto actualizado",
    "descripcion": "Descripcion actualizada",
    "precio": 125000
  }
}
```

## 8. Probar con Postman o Insomnia

GraphQL usa peticiones HTTP `POST` al mismo endpoint para consultas y mutaciones.

Configura una peticion con estos valores:

```text
Metodo: POST
URL: http://localhost:3000/graphql
Header: Content-Type: application/json
```

En el cuerpo selecciona `raw` y formato `JSON`:

```json
{
  "query": "query { productos { id nombre precio } }"
}
```

Para una mutacion con variables:

```json
{
  "query": "mutation CrearProducto($input: ProductoInput!) { crearProducto(input: $input) { id nombre precio } }",
  "variables": {
    "input": {
      "nombre": "Audifonos",
      "descripcion": "Audifonos con microfono",
      "precio": 175000
    }
  }
}
```

La respuesta HTTP deberia contener un objeto con `data` cuando la operacion sea exitosa. Cuando haya un problema de sintaxis, tipos o ejecucion, GraphQL normalmente incluye un arreglo `errors`.

## 9. Probar con curl

En Windows PowerShell puedes ejecutar una consulta asi:

```powershell
$body = @{ query = 'query { productos { id nombre precio } }' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/graphql' -ContentType 'application/json' -Body $body
```

Para crear un producto:

```powershell
$body = @{
  query = 'mutation CrearProducto($input: ProductoInput!) { crearProducto(input: $input) { id nombre precio } }'
  variables = @{
    input = @{
      nombre = 'Base para laptop'
      descripcion = 'Base ajustable para laptop'
      precio = 110000
    }
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/graphql' -ContentType 'application/json' -Body $body
```

## 10. Pruebas negativas y validaciones

Ademas de comprobar los casos exitosos, prueba que la API rechace datos incorrectos.

### Campo obligatorio faltante

Esta consulta debe producir un error porque falta `precio`:

```graphql
mutation {
  crearProducto(input: {
    nombre: "Producto incompleto"
    descripcion: "No tiene precio"
  }) {
    id
  }
}
```

### Tipo incorrecto

Esta consulta debe producir un error porque `precio` espera un numero:

```graphql
mutation {
  crearProducto(input: {
    nombre: "Producto invalido"
    descripcion: "Precio enviado como texto"
    precio: "mucho"
  }) {
    id
  }
}
```

### Producto inexistente

```graphql
query {
  producto(id: "999999") {
    id
    nombre
  }
}
```

Verifica que la respuesta sea `null` y que el servidor siga funcionando.

### Nombre o descripcion vacios

```graphql
mutation {
  crearProducto(input: {
    nombre: ""
    descripcion: "Descripcion valida"
    precio: 1000
  }) {
    id
  }
}
```

El modelo tiene validacion para evitar valores vacios. La respuesta debe informar un error y no debe crear el registro.

### Precio negativo

```graphql
mutation {
  crearProducto(input: {
    nombre: "Producto con precio invalido"
    descripcion: "Prueba de validacion"
    precio: -100
  }) {
    id
  }
}
```

El modelo define un precio minimo de cero, por lo que esta operacion debe fallar.

### Campo que no existe

```graphql
query {
  productos {
    campoInventado
  }
}
```

GraphQL debe indicar que `campoInventado` no pertenece al tipo `Producto`.

## 11. Lista minima de pruebas

Para una entrega o demostracion, ejecuta como minimo estas pruebas y guarda sus respuestas:

- El servidor responde en `/health`.
- GraphQL responde a la consulta `health`.
- Se pueden listar productos.
- Se puede buscar un producto existente.
- Se puede buscar un producto inexistente y devuelve `null`.
- Se puede crear un producto valido.
- Se puede actualizar el producto creado.
- La consulta posterior confirma la actualizacion.
- Se puede eliminar el producto creado.
- La consulta posterior confirma la eliminacion.
- Se rechaza un campo obligatorio faltante.
- Se rechaza un precio negativo.
- Se rechaza un tipo de dato incorrecto.

## 12. Como interpretar una respuesta GraphQL

Respuesta exitosa:

```json
{
  "data": {
    "productos": []
  }
}
```

Respuesta con error:

```json
{
  "errors": [
    {
      "message": "Mensaje descriptivo del error"
    }
  ]
}
```

Una respuesta puede incluir `data` y `errors` al mismo tiempo si una parte de la operacion pudo resolverse y otra parte fallo. Siempre revisa ambos campos cuando pruebes una operacion.

## 13. Orden rapido para una demostracion

Si necesitas mostrar el funcionamiento en pocos minutos, sigue este orden:

1. Abre GraphiQL en `http://localhost:3000/graphql`.
2. Ejecuta `health`.
3. Lista los productos.
4. Crea un producto y copia su ID.
5. Busca ese producto por ID.
6. Actualízalo.
7. Vuelve a consultarlo para verificar el cambio.
8. Elimínalo.
9. Vuelve a consultarlo y verifica que devuelva `null`.
10. Ejecuta una prueba negativa, como un precio negativo.

Con esta secuencia demuestras lectura, escritura, actualizacion, eliminacion y validacion de errores en la API.
