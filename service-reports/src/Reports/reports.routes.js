'use strict';

import { Router } from 'express';
import { getTopProducts, getCategoriesSummary, getInventorySummary } from './reports.controller.js';
import { validateJWT } from '../../middleware/validateJWT.js';

const router = Router();

// GET /api/v1/reports/top-products
router.get('/top-products', validateJWT, getTopProducts);

// GET /api/v1/reports/categories
router.get('/categories', validateJWT, getCategoriesSummary);

// GET /api/v1/reports/summary
router.get('/summary', validateJWT, getInventorySummary);

export default router;