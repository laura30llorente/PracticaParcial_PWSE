// Importamos el módulo 'mongoose', que proporciona una interfaz para interactuar con MongoDB en Node.js
const mongoose = require('mongoose');

// Importamos el módulo mongoose-delete 
const mongooseDelete = require("mongoose-delete")

// Definimos un esquema (schema) para el modelo de businesses
const BusinessSchema = new mongoose.Schema(
    {
        // Campo 'name' de tipo String en el esquema
        name: { 
            type: String, 
            required: true 
        },

        // Campo 'cif' de tipo String en el esquema
        cif: { 
            type: String, 
            required: true, 
            unique: true        // El cif es unico
        },

        // Campo 'address' de tipo String en el esquema
        address: { 
            type: String, 
            required: true 
        },

        // Campo 'email' de tipo String en el esquema
        email: { 
            type: String, 
            required: true 
        },

        // Campo 'contactPhone' de tipo String en el esquema
        contactPhone: { 
            type: String, 
            required: true 
        },

        // Campo 'pageId' de tipo Number en el esquema
        pageId: { 
            type: Number, 
            required: true 
        }
    },
    {
        // Opciones del esquema
        timestamps: true, 
        versionKey: false 
    }
);

// Agregamos el plugin de eliminación suave al esquema "BusinessSchema" de Mongoose
// El plugin se configura para sobrescribir todos los métodos y habilitar la funcionalidad de eliminación suave
BusinessSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true })

// Exportamos el modelo 'businesses' basado en el esquema 'BusinessSchema' 
module.exports = mongoose.model("businesses", BusinessSchema);   // "businesses" es el nombre de la colección en MongoDB (de la tabla en SQL)