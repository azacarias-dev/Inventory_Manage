import { Router } from 'express';
import {
    getProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto
} from './Productos.controller.js';
import { validateCreateProducto, validateUpdateProducto, validateDeleteProducto } from '../../middlewares/Productos-Validators.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProducto);
router.post('/', validateCreateProducto, createProducto);
router.put('/:id', validateUpdateProducto, updateProducto);
router.delete('/:id', validateDeleteProducto, deleteProducto);

export default router;