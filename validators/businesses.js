// Importamos el validador 'check' de express-validator
const { check } = require("express-validator");

// Importamos la función de manejo de resultados de validación personalizada
const validateResults = require("../utils/handleValidator");

// NOTA: check busca el campo en cualquier parte de la peticion (params, header y body)

// Definición de la matriz de validadores para la creación de un ítem
// Lo usaremos para POST (createBusiness) y PUT (updateBusinessByCIF)
const validatorCreateItem = [

    // Validamos que el campo 'name' exista, no esté vacío y tenga una longitud entre 1 y 30 caracteres
    check("name").exists().notEmpty().isLength({ min: 1, max: 30 }).withMessage("El nombre es obligatorio y debe tener entre 1 y 30 caracteres"),

    // Validamos que el campo 'cif' exista, no esté vacío y tenga una longitud exacta de 9 caracteres
    check("cif").exists().notEmpty().isLength({ min: 9, max: 9 }).withMessage("El CIF es obligatorio y debe tener 9 caracteres"),

    // Validamos que el campo 'address' exista, no esté vacío y tenga una longitud entre 1 y 255 caracteres
    check("address").exists().notEmpty().isLength({ min: 1, max: 255 }).withMessage("La dirección es obligatoria y debe tener entre 1 y 255 caracteres"),

    // Validamos que el campo 'email' exista, no esté vacío y tenga un formato de correo electrónico válido
    check("email").exists().notEmpty().isEmail().withMessage("El correo electrónico es obligatorio y debe tener un formato válido"),

    // Validamos que el campo 'contactPhone' exista, no esté vacío, tenga formato de número de teléfono válido y tenga una longitud mínima de 7 caracteres y máxima de 20 caracteres
    check("contactPhone").exists().notEmpty().isMobilePhone().isLength({ min: 7, max: 20 }).withMessage("El número de teléfono de contacto es obligatorio, debe tener un formato válido y debe tener entre 7 y 20 caracteres"),

    // Validamos que el campo 'pageId' exista, no esté vacío y tenga una longitud máxima de 50 caracteres
    check("pageId").exists().notEmpty().isLength({ max: 50 }).withMessage("El ID de página es obligatorio y no puede exceder los 50 caracteres"),

    // Middleware adicional para manejar los resultados de la validación
    (req, res, next) => validateResults(req, res, next)
];

// Definición de la matriz de validadores para obtener un ítem
// Lo usaremos para GET (getBusinessByCIF), PUT (updateBusinessByCIF), PATCH (modifyBusinessByCIF) y DELETE (deleteBusinessByCIF)
const validatorGetItem = [

    // Validamos que el campo 'cif_ruta' exista, no esté vacío y tenga una longitud exacta de 9 caracteres
    check("cif_ruta").exists().notEmpty().isLength({ min: 9, max: 9 }).withMessage("El CIF es obligatorio y debe tener 9 caracteres"),

    // Middleware adicional para manejar los resultados de la validación utilizando la función validateResults
    (req, res, next) => validateResults(req, res, next)
];

// Definición de la matriz de validadores para actualizar un ítem
// Lo usaremos para PATCH (modifyBusinessByCIF)
const validatorModifyItem = [

    // Validamos que si el campo 'name' está presente, tenga una longitud entre 1 y 30 caracteres
    check("name").optional().isLength({ min: 1, max: 30 }).withMessage("El nombre debe tener entre 1 y 30 caracteres"),

    // Validamos que si el campo 'cif' está presente, tenga una longitud exacta de 9 caracteres
    check("cif").optional().isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres"),

    // Validamos que si el campo 'address' está presente, tenga una longitud entre 1 y 255 caracteres
    check("address").optional().isLength({ min: 1, max: 255 }).withMessage("La dirección debe tener entre 1 y 255 caracteres"),

    // Validamos que si el campo 'email' está presente, tenga un formato de correo electrónico válido
    check("email").optional().isEmail().withMessage("El correo electrónico debe tener un formato válido"),

    // Validamos que si el campo 'contactPhone' está presente, tenga un formato de número de teléfono válido y tenga una longitud mínima de 7 caracteres y máxima de 20 caracteres
    check("contactPhone").optional().isMobilePhone().isLength({ min: 7, max: 20 }).withMessage("El número de teléfono de contacto debe tener un formato válido y debe tener entre 7 y 20 caracteres"),

    // Validamos que si el campo 'pageId' está presente, tenga una longitud máxima de 50 caracteres
    check("pageId").optional().isLength({ max: 50 }).withMessage("El ID de página no puede exceder los 50 caracteres"),

    // Middleware adicional para manejar los resultados de la validación
    (req, res, next) => validateResults(req, res, next)
];

// Exportamos los validadores para su uso en otros archivos
module.exports = { validatorCreateItem, validatorGetItem, validatorModifyItem };