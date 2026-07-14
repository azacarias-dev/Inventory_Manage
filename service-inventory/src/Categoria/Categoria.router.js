import { Router } from 'express';
import { getCategorias, getCategoria, createCategoria, updateCategoria, desactivarCategoria, activarCategoria } from './Categoria.controller.js';
import { validateCreateCategoria, validateUpdateCategoria, validateDeleteCategoria } from '../../middlewares/Categoria-validators.js';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoria);
router.post('/', validateCreateCategoria, createCategoria);
router.put('/:id', validateUpdateCategoria, updateCategoria);
router.patch('/:id', validateDeleteCategoria, desactivarCategoria);
router.put('/activar/:id', validateDeleteCategoria, activarCategoria);


export default router;