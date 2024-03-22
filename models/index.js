// Creamos un objeto llamado 'models'
const models = {
    // Asignamos al atributo 'businessesModel' la referencia al modelo de usuarios ubicado en './nosql/businesses'
    businessesModel: require('./nosql/businesses'),
};

// Exportamos el objeto 'models' para que pueda ser utilizado en otros archivos
module.exports = models;