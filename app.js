// Importamos el módulo 'express' que permite crear aplicaciones web en Node.js
const express = require("express");

// Importamos el módulo 'cors' que ayuda a manejar las solicitudes CORS 
const cors = require("cors");

// Importamos la función dbConnect desde el archivo 'mongo.js' ubicado en la carpeta 'config'
const dbConnect = require('./config/mongo');

// Importamos el módulo 'dotenv' para cargar las variables de entorno desde un archivo .env
require('dotenv').config();   // NOTA: tiene que aparecer antes que los routers

// Llamamos a la función dbConnect para establecer la conexión a la base de datos
dbConnect();

// Creamos una instancia de la aplicación Express
const app = express();

// Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
// Configuramos la aplicación para usar el middleware 'cors' y permitir asi solicitudes desde diferentes dominios
app.use(cors());

// Configuramos la aplicación para utilizar el middleware que convierte los datos de las solicitudes a formato JSON
app.use(express.json());

// Para hacer use de todos los routers sin hacerlo uno a uno
app.use("/api", require("./routes"))   // Lee routes/index.js por defecto

// Definimos el puerto en el que la aplicación escuchará las solicitudes
// Utilizamos el operador de fusión nula (??) para asignar el valor predeterminado 3000 si PORT no está definido en las variables de entorno (.env)
const port = process.env.PORT ?? 3000;

// Iniciamos el servidor y le decimos que escuche en el puerto especificado
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port);
});