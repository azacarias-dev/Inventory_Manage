'use strict';
import { Router } from 'express';
import { getLowStockAlerts } from './alerts.controller.js';
import { validateJWT } from '../../middleware/validateJWT.js';

const router = Router();

// GET /api/v1/alerts/low-stock
router.get('/low-stock', validateJWT, getLowStockAlerts);

export default router;