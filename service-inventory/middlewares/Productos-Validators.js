import { body, param } from 'express-validator';

export const validateCreateProducto = [
    body('nombreProducto').notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcion').notEmpty().withMessage('La descripcion del producto es requerida'),
    body('precio').notEmpty().withMessage('El precio del producto es requerido'),
    body('stock').notEmpty().withMessage('El stock del producto es requerido'),
    body('categoria').notEmpty().withMessage('La categoria del producto es requerida'),
    body('estado').notEmpty().withMessage('El estado del producto es requerido'),
]

export const validateUpdateProducto = [
    param('id').notEmpty().withMessage('El id del producto es requerido'),
    body('nombreProducto').notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcion').notEmpty().withMessage('La descripcion del producto es requerida'),
    body('precio').notEmpty().withMessage('El precio del producto es requerido').isNumeric().withMessage('El precio debe ser numerico'),
    body('stock').notEmpty().withMessage('El stock del producto es requerido').isNumeric().withMessage('El stock debe ser numerico'),
    body('categoria').notEmpty().withMessage('La categoria del producto es requerida'),
    body('estado').notEmpty().withMessage('El estado del producto es requerido').isBoolean().withMessage('El estado debe ser booleano'),
]

export const validateDeleteProducto = [
    param('id').notEmpty().withMessage('El id del producto es requerido'),
]