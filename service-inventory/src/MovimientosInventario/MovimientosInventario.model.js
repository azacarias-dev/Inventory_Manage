'use strict'

import mongoose from 'mongoose';

const movimientosInventarioSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    razon: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('MovimientosInventario', movimientosInventarioSchema);