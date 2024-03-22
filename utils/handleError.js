// Definición de la función handleHttpError
const handleHttpError = (res, message, code = 403) => {   // 403 es el error por defecto
    // Configuración del código de estado y envío del mensaje de error en la respuesta HTTP
    res.status(code).send(message);
}

// Exportamos la función handleHttpError para que pueda ser utilizada en otros archivos
module.exports = { handleHttpError };