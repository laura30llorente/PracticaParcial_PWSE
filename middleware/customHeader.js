// Importamos la función handleHttpError desde el archivo '../utils/handleError'
const { handleHttpError } = require('../utils/handleError');

// Definición de la función middleware customHeader
const customHeader = (req, res, next) => {
    try {
        // Intentamos obtener la apiKey del encabezado de la solicitud
        const apiKey = req.headers.api_key;
        
        // Verificamos si la apiKey coincide con la api key establecida en las variables de entorno (.env)
        if (apiKey === process.env.API_KEY) {
            // Si coincide, permitimos que la solicitud continúe hacia el siguiente middleware o controlador de ruta
            next();
        } else {
            /* Si la apiKey no es correcta, respondemos con un código de estado 403 (Prohibido) y un mensaje
            usando para ello la función handleHttpError */ 
            handleHttpError(res, 'ERROR_CUSTOM_HEADER: La apiKey no es correcta', 403);
        }
    } catch (err) {
        /* Si ocurre un error, respondemos con un código de estado 403 (Prohibido) y el mensaje de error
        usando para ello la función handleHttpError */ 
        handleHttpError(res, err, 403);
    }
}

// Exportamos la función customHeader para que pueda ser utilizada en otros archivos
module.exports = customHeader;