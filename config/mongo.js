// Importamos el módulo 'mongoose', que proporciona una interfaz para interactuar con MongoDB en Node.js
const mongoose = require('mongoose');

// Definimos una función llamada 'dbConnect', que será exportada y utilizada para establecer la conexión con la base de datos
const dbConnect = () => {
  
    // Obtenemos la URI de la base de datos desde las variables de entorno definidas en el fichero .env
    const db_uri = process.env.DB_URI;

    // Configuramos Mongoose para permitir consultas menos estrictas (strictQuery)
    mongoose.set('strictQuery', false);

    try {
        // Intentamos conectar con la base de datos utilizando la URI proporcionada
        mongoose.connect(db_uri);
    } catch (error) {
        // Si hay un error durante la conexión, mostramos un mensaje de error en la consola
        console.error("Error conectando a la BD:", error);
    }

    // Escuchamos eventos relacionados con la conexión a la base de datos
    mongoose.connection.on("connected", () => console.log("Conectado a la BD"));
}

// Exportamos la función 'dbConnect' para que pueda ser utilizada en otros archivos
module.exports = dbConnect;