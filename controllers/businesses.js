// Importamos el modelo 'businessesModel' desde el archivo '../models'
const { businessesModel } = require('../models');

// Importamos la función matchedData de express-validator
const { matchedData } = require('express-validator');

// Importamos la función handleHttpError desde el archivo '../utils/handleError'
const { handleHttpError } = require('../utils/handleError');


/**
 * Obtener la lista de comercios y, opcionalmente (vía parámetro query) ordenados por el CIF ascendentemente
 * @param {*} req - Objeto de solicitud (request) de Express
 * @param {*} res - Objeto de respuesta (response) de Express
*/

const getBusinesses = async (req, res) => {
  try {
    // Extraemos el parámetro orderByCif de los parámetros de consulta (query parameters) de la solicitud
    const { orderByCif } = req.query;
    
    // Inicializamos una consulta Mongoose para encontrar todos los documentos en la colección 'businessesModel'
    let query = businessesModel.find({});

    /* Si se proporcionó el parámetro orderByCif y es true, modificamos la consulta 
    para ordenar los resultados por 'cif' de forma ascendente.
    Si no se especifica orderByCif o se pone un valor diferente a true, se ordenarán
    con el orden predeterminado por Mongo */

    if (orderByCif === 'true') {
      // Modificamos la consulta almacenada en la variable query para incluir una instrucción de ordenamiento ascendente
      query = query.sort({ cif: 'asc' });
    }

    // Ejecutamos la consulta con el posible ordenamiento y esperamos a que se complete, almacenando los resultados en 'data'
    const data = await query.exec();

    // Enviamos la respuesta HTTP con los datos obtenidos de la consulta
    res.send(data);

  } catch (error) {
    /* En caso de cualquier error durante la ejecución del bloque try, capturamos el error
    y utilizamos la función handleHttpError para manejar el error y enviar una respuesta
    de error HTTP 500 (Internal Server Error), indicando un error del servidor */
    handleHttpError(res, 'ERROR_GET_BUSINESSES: Error al obtener los comercios', 500);
  }
};

/**
 * Obtener un comercio por su CIF
 * @param {*} req - Objeto de solicitud (request) de Express
 * @param {*} res - Objeto de respuesta (response) de Express
*/

const getBusinessByCIF = async (req, res) => {
    try {
      // Utilizamos matchedData para obtener solo los datos validados de la solicitud (filtrados por el modelo)
      const { cif_ruta } = matchedData(req)  // Extraemos el cif de la ruta de la peticion

      /* Realizamos una búsqueda en la base de datos para encontrar un solo documento
      que coincida con el CIF proporcionado */
      const data = await businessesModel.findOne({ cif: cif_ruta });

      /* Si no se encuentra ningún comercio que coincida con el CIF proporcionado,
      utilizamos la función handleHttpError para manejar el error y enviar una respuesta 
      HTTP 404 (Not Found) para indicar que el recurso no fue encontrado */
      if (!data) {
        return handleHttpError(res, 'ERROR_GET_BUSINESS_BY_CIF: El comercio con ese CIF no existe', 404);
      }
      
      // Si se encuentra el comercio, enviamos la respuesta HTTP con los datos obtenidos de la consulta
      res.send(data);

    } catch (error) {
      /* En caso de cualquier error durante la ejecución del bloque try, capturamos el error
      y utilizamos la función handleHttpError para manejar el error y enviar una respuesta
      de error HTTP 500 (Internal Server Error), indicando un error del servidor */
      handleHttpError(res, 'ERROR_GET_BUSINESS_BY_CIF: Error al obtener el comercio', 500);
    }
};

/**
 * Guardar un comercio
 * @param {*} req - Objeto de solicitud (request) de Express
 * @param {*} res - Objeto de respuesta (response) de Express
*/

const createBusiness = async (req, res) => {
  try {
    // Utilizamos matchedData para obtener solo los datos validados de la solicitud (filtrados por el modelo)
    const body = matchedData(req);  // Extraemos el cuerpo de la solicitud

    // Intentamos crear un nuevo documento utilizando el método 'create' del modelo 'businessesModel'
    const data = await businessesModel.create(body);

    // Enviamos la respuesta HTTP con los datos obtenidos de la consulta
    res.send(data);

  } catch (error) {

    // Manejamos errores de validación de MongoDB, utilizando la función handleHttpError
    if (error.name === 'ValidationError') {
      return handleHttpError(res, 'ERROR_VALIDATION: Error de validación al guardar el comercio', 400);
    }

    // Manejamos errores de duplicado --> error 409 (Conflict), utilizando la función handleHttpError
    // El código de error 11000 en MongoDB está asociado con violaciones de restricciones de índices únicos
    if (error.code && error.code === 11000) {
      return handleHttpError(res, 'ERROR_DUPLICATE: El comercio con ese CIF ya existe', 409);
    }

    // Si el error no coincide con los anteriores, lo manejamos como un error del servidor
    // Error 500 (Internal Server Error), utilizando la función handleHttpError
    handleHttpError(res, 'ERROR_CREATE_BUSINESS: Error al guardar el comercio', 500);
  }
};

/**
 * Modificar un comercio a partir de su CIF
 * @param {*} req - Objeto de solicitud (request) de Express
 * @param {*} res - Objeto de respuesta (response) de Express
*/

const updateBusinessByCIF = async (req, res) => {
  try {
      // Extraemos el cif de la ruta y el resto lo asignamos a la constante body, mediante matchedData
      const { cif_ruta, ...body } = matchedData(req);

      // Nos aseguramos que no se pueda cambiar el cif
      if (body.cif !== cif_ruta) { 
        // Mandamos un error 400 (Bad Request) utilizando la función handleHttpError
        return handleHttpError(res, 'ERROR_UPDATE_BUSINESS_BY_CIF: No se puede cambiar el CIF del comercio', 400);
      }
      
      // Modificamos el item que tiene ese CIF en la base de datos utilizando el modelo de comercios
      // replace o replaceOne implica reemplazar completamente un documento existente con uno nuevo
      const data = await businessesModel.findOneAndReplace({ cif: cif_ruta }, body); 

      /* Si no se encuentra ningún comercio que coincida con el CIF proporcionado,
      utilizamos la función handleHttpError para manejar el error y enviar una respuesta 
      HTTP 404 (Not Found) para indicar que el recurso no fue encontrado */
      if (!data) {
        return handleHttpError(res, 'ERROR_UPDATE_BUSINESS_BY_CIF: El comercio con ese CIF no existe', 404);
      }
      
      // Enviamos los datos obtenidos como respuesta HTTP
      res.send(data);

  } catch (error) {
      /* En caso de cualquier error durante la ejecución del bloque try, capturamos el error
      y utilizamos la función handleHttpError para manejar el error y enviar una respuesta
      de error HTTP 500 (Internal Server Error), indicando un error del servidor */
      handleHttpError(res, 'ERROR_UPDATE_BUSINESS_BY_CIF: Error al actualizar el comercio', 500);
  }
};

/**
 * Modificar solo algunos campos de un comercio a partir de su CIF
 * @param {*} req - Objeto de solicitud (request) de Express
 * @param {*} res - Objeto de respuesta (response) de Express
*/

const modifyBusinessByCIF = async (req, res) => {
  try {
      // Extraemos el cif de la ruta y el resto lo asignamos a la constante body, mediante matchedData
      const { cif_ruta, ...body } = matchedData(req);

      // Nos aseguramos que no se pueda cambiar el cif
      // En este caso, al ser PATCH y no PUT, el CIF no tiene por qué aportarse en el body, por lo que lo comprobamos
      if (body.cif && body.cif !== cif_ruta) { 
        // Mandamos un error 400 (Bad Request) utilizando la función handleHttpError
        return handleHttpError(res, 'ERROR_MODIFY_BUSINESS_BY_CIF: No se puede cambiar el CIF del comercio', 400);
      }
      
      // Modificamos solo los datos recibidos en el body del item que tiene ese CIF en la base de datos utilizando el modelo de comercios
      // update o updateOne se utiliza para realizar actualizaciones parciales en un documento existente
      const data = await businessesModel.findOneAndUpdate({ cif: cif_ruta }, body); 

      /* Si no se encuentra ningún comercio que coincida con el CIF proporcionado,
      utilizamos la función handleHttpError para manejar el error y enviar una respuesta 
      HTTP 404 (Not Found) para indicar que el recurso no fue encontrado */
      if (!data) {
        return handleHttpError(res, 'ERROR_MODIFY_BUSINESS_BY_CIF: El comercio con ese CIF no existe', 404);
      }
      
      // Enviamos los datos obtenidos como respuesta HTTP
      res.send(data);

  } catch (error) {
      /* En caso de cualquier error durante la ejecución del bloque try, capturamos el error
      y utilizamos la función handleHttpError para manejar el error y enviar una respuesta
      de error HTTP 500 (Internal Server Error), indicando un error del servidor */
      handleHttpError(res, 'ERROR_MODIFY_BUSINESS_BY_CIF: Error al modificar el comercio', 500);
  }
};

/**
 * Borrar un comercio a partir de su CIF, y permite elegir entre un borrado 
 * lógico o físico (vía parámetro query)
 * @param {*} req - Objeto de solicitud (request) de Express
 * @param {*} res - Objeto de respuesta (response) de Express
*/

const deleteBusinessByCIF = async (req, res) => {
  try {
    // Utilizamos matchedData para obtener solo los datos validados de la solicitud (filtrados por el modelo)
    const { cif_ruta } = matchedData(req)   // Extraemos el cif de la ruta de la peticion

    // Obtenemos del parametro query si se quiere un soft delete (logico) o un hard delete (fisico)
    const { softDelete } = req.query;
    
    // Primero, intentamos encontrar el comercio por el CIF para ver si existe
    const existingBusiness = await businessesModel.findOne({ cif: cif_ruta });

    /* Si no se encuentra ningún comercio que coincida con el CIF proporcionado,
    utilizamos la función handleHttpError para manejar el error y enviar una respuesta 
    HTTP 404 (Not Found) para indicar que el recurso no fue encontrado */
    if (!existingBusiness) {
      return handleHttpError(res, 'ERROR_DELETE_BUSINESS_BY_CIF: El comercio con ese CIF no existe para eliminar', 404);
    }

    /* Si se proporcionó el parámetro softDelete y es true, hacemos un borrado
    lógico. Si no se especifica softDelete o se pone un valor diferente a true, se 
    realizará un borrado físico. */

    let data;
    
    if (softDelete === 'true') {    // Borrado lógico    

      data = await businessesModel.delete({ cif: cif_ruta});
      
    } else {   // Borrado fisico

      data = await businessesModel.deleteOne({ cif: cif_ruta });

    }

    // Enviamos los datos obtenidos como respuesta HTTP
    res.send(data);

  } catch (error) {
    /* En caso de cualquier error durante la ejecución del bloque try, capturamos el error
    y utilizamos la función handleHttpError para manejar el error y enviar una respuesta
    de error HTTP 500 (Internal Server Error), indicando un error del servidor */
    handleHttpError(res, 'ERROR_DELETE_BUSINESS_BY_CIF: Error al eliminar el comercio', 500);
  }
};

// Exportamos un objeto que contiene todas las funciones manejadoras como propiedades
module.exports = { getBusinesses, getBusinessByCIF, createBusiness, updateBusinessByCIF, modifyBusinessByCIF, deleteBusinessByCIF };