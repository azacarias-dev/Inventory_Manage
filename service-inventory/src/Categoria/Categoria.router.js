import { Router } from 'express';
import { getCategorias, getCategoria, createCategoria, updateCategoria, desactivarCategoria } from './Categoria.controller.js';
import { validateCreateCategoria, validateUpdateCategoria, validateDeleteCategoria } from '../../middlewares/Categoria-validators.js';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoria);
router.post('/', validateCreateCategoria, createCategoria);
router.put('/:id', validateUpdateCategoria, updateCategoria);
router.patch('/:id', validateDeleteCategoria, desactivarCategoria);

export default router;