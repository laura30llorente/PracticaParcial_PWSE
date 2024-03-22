// Importamos el módulo 'express' y 'fs' (file system) de Node.js
const express = require("express");
const fs = require("fs");

// Creamos un objeto router utilizando la función Router de Express
const router = express.Router();

// Definimos una función llamada 'removeExtension' que toma un nombre de archivo y devuelve la parte antes del primer punto (extensión)
const removeExtension = (fileName) => {
    // Solo toma la primera parte del resultado de 'split' (lo que está antes del primer punto)
    return fileName.split('.').shift();
};

// Leemos de manera síncrona los nombres de archivos en el directorio actual (__dirname)
fs.readdirSync(__dirname).filter((file) => {
    // Obtenemos el nombre del archivo sin la extensión
    const name = removeExtension(file);   // Puede ser 'index', 'businesses'

    // Si el nombre del archivo no es 'index', utiliza el router para asociar la ruta '/nombre' con el módulo requerido
    if (name !== 'index') {
        router.use('/' + name, require('./' + name));   // Por ejemplo, http://localhost:3000/api/businesses
    }
});

// Exportamos el objeto router para que pueda ser utilizado en otros archivos
module.exports = router;