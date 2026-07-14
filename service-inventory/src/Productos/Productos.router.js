import { Router } from 'express';
import {
    getProductos,
    getProducto,
    createProducto,
    updateProducto,
    desactivarProducto,
    activarProducto,
    buscarProductoPorCategoriaById,
    buscarProductoPorNombre
} from './Productos.controller.js';
import { validateCreateProducto, validateUpdateProducto, validateDeleteProducto, validateSearchProducto } from '../../middlewares/Productos-Validators.js';

const router = Router();

router.get('/', getProductos);
router.get('/buscarPorCategoria/:id', validateSearchProducto, buscarProductoPorCategoriaById);
router.get('/buscarPorNombre/:nombrescoincidentes', validateSearchProducto, buscarProductoPorNombre);
router.get('/:id', getProducto);
router.post('/', validateCreateProducto, createProducto);
router.put('/:id', validateUpdateProducto, updateProducto);
router.patch('/:id', validateDeleteProducto, desactivarProducto);
router.put('/desactivar/:id', validateDeleteProducto, desactivarProducto);
router.put('/activar/:id', validateDeleteProducto, activarProducto);

export default router;