'use strict'

import mongoose from "mongoose";

const productoSchema = mongoose.Schema({
    nombreProducto: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Producto', productoSchema);