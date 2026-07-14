'use strict'

import mongoose from "mongoose";

const categoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Categoria', categoriaSchema);
