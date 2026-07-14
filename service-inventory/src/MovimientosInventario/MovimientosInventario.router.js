import express from "express";
import { getMovimientosInventario, getMovimientoInventario, createMovimientosInventario } from "./MovimientosInventario.controller.js";
import { validateCreateMovimientosInventario } from "../../middlewares/MovimientosInventario-Validators.js";

const router = express.Router();

router.get('/', getMovimientosInventario);
router.get('/:id', getMovimientoInventario);
router.post('/', validateCreateMovimientosInventario, createMovimientosInventario);

export default router;