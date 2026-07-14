import { body, param } from 'express-validator';

export const validateCreateMovimientosInventario = [
    body('usuario').notEmpty().withMessage('El usuario es requerido'),
    body('producto').notEmpty().withMessage('El producto es requerido'),
    body('tipo').notEmpty().withMessage('El tipo es requerido').isIn(['INGRESO', 'SALIDA']),
    body('cantidad').notEmpty().withMessage('La cantidad es requerida').isNumeric().withMessage('La cantidad debe ser un numero'),
    body('razon').notEmpty().withMessage('La razon es requerida'),
];

