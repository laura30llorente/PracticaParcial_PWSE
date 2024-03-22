// Importamos la función validationResult de express-validator
const { validationResult } = require("express-validator");

// Definición de la función middleware validateResults
const validateResults = (req, res, next) => {
    try {
        // Utilizamos la función validationResult para obtener los resultados de la validación
        // Si hay errores, lanzamos una excepción para ser capturada en el bloque catch
        validationResult(req).throw();

        // Si no hay errores, permitimos que la solicitud continúe hacia el siguiente middleware o controlador de ruta
        return next();
    } catch (err) {
        // Si hay errores, respondemos con un código de estado 403 (Prohibido) y un objeto JSON que contiene los errores
        res.status(403).send({ errors: err.array() });
    }
}

// Exportamos la función validateResults para que pueda ser utilizada en otros archivos
module.exports = validateResults;