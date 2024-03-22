// Importamos express
const express = require('express');

// Creamos un router para los comercios
const routerBusinesses = express.Router();

// Importamos las funciones desde el módulo "../controllers/businesses"
const { getBusinesses, getBusinessByCIF, createBusiness, updateBusinessByCIF, modifyBusinessByCIF, deleteBusinessByCIF } = require("../controllers/businesses");

// Importamos el conjunto de validadores desde el archivo "../validators/businesses"
const { validatorCreateItem, validatorGetItem, validatorModifyItem } = require("../validators/businesses");

// Importamos el customHeader del middleware
/* El middleware customHeader verifica si la solicitud entrante incluye una apiKey específica en sus encabezados (headers). 
Esto actúa como un mecanismo de autenticación y autorización, asegurando que solo las solicitudes que conocen y envían la 
apiKey correcta puedan acceder a ciertas rutas. Es una forma de controlar quién puede hacer qué en el sistema. */
const customHeader = require('../middleware/customHeader');

// RUTAS

// Definimos una ruta POST en Express utilizando el router y el validator validatorCreateItem
/* Se utiliza validatorCreateItem para asegurar que todos los campos necesarios para crear un nuevo comercio 
estén presentes, no estén vacíos, y cumplan con los criterios específicos (como longitud y formato) */
routerBusinesses.post("/", customHeader, validatorCreateItem, createBusiness);

// Definimos una ruta GET de un comercio en Express utilizando el router y el validator validatorGetItem
/* Se utiliza validatorGetItem porque verifica que el identificador CIF proporcionado en la ruta sea válido 
(existente, no vacío, y de longitud exacta) */
routerBusinesses.get("/:cif_ruta", customHeader, validatorGetItem, getBusinessByCIF)

// Definimos una ruta GET de todos los comercios en Express utilizando el router 
// No se requiere validador porque esta ruta lista todos los comercios, sin necesidad de validar datos de entrada específicos
routerBusinesses.get("/", customHeader, getBusinesses)

// Definimos una ruta PUT en Express utilizando el router y los validators validatorGetItem y validatorCreateItem
/* validatorGetItem asegura que el CIF del comercio a actualizar sea válido, 
validatorCreateItem garantiza que los datos proporcionados para la actualización sean completos y correctos */
routerBusinesses.put("/:cif_ruta", customHeader, validatorGetItem, validatorCreateItem, updateBusinessByCIF)

// Definimos una ruta PATCH en Express utilizando el router y los validators validatorGetItem y validatorModifyItem
/* validatorGetItem asegura que el CIF del comercio a modificar sea válido, 
validatorModifyItem asegura que cualquier campo presente para modificar cumpla con los requisitos específicos
En este caso, no todos los campos necesitan estar presentes como en PUT */
routerBusinesses.patch("/:cif_ruta", customHeader, validatorGetItem, validatorModifyItem, modifyBusinessByCIF)

// Definimos una ruta DELETE en Express utilizando el router y el validator validatorGetItem
/* Se utiliza validatorGetItem porque verifica que el identificador CIF proporcionado en la ruta sea válido 
(existente, no vacío, y de longitud exacta) */
routerBusinesses.delete("/:cif_ruta", customHeader, validatorGetItem, deleteBusinessByCIF)

// Exportamos el router
module.exports = routerBusinesses;