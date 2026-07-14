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
        enum: ['INGRESO', 'SALIDA'],
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
    },
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('MovimientosInventario', movimientosInventarioSchema);