import { body, param } from 'express-validator'

export const validateCreateCategoria = [
    body('nombre').notEmpty().withMessage('El nombre de la categoria es requerido'),
    body('descripcion').notEmpty().withMessage('La descripcion de la categoria es requerida'),
    body('estado').notEmpty().withMessage('El estado de la categoria es requerido'),
]

export const validateUpdateCategoria = [
    param('id').notEmpty().withMessage('El id de la categoria es requerido'),
    body('nombre').notEmpty().withMessage('El nombre de la categoria es requerido'),
    body('descripcion').notEmpty().withMessage('La descripcion de la categoria es requerida'),
    body('estado').notEmpty().withMessage('El estado de la categoria es requerido'),
]

export const validateDeleteCategoria = [
    param('id').notEmpty().withMessage('El id de la categoria es requerido'),
]