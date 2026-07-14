import express from "express";
import { getMovimientosInventario, getMovimientoInventario, createMovimientosInventario, getMovimientosPorTipo, desactivarMovimientoInventario } from "./MovimientosInventario.controller.js";
import { validateCreateMovimientosInventario } from "../../middlewares/MovimientosInventario-Validators.js";

const router = express.Router();

router.get('/', getMovimientosInventario);
router.get('/tipo/:tipo', getMovimientosPorTipo);
router.get('/:id', getMovimientoInventario);
router.post('/', validateCreateMovimientosInventario, createMovimientosInventario);
router.put('/cancelar/:id', desactivarMovimientoInventario);

export default router;