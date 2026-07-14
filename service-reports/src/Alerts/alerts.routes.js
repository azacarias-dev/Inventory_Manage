'use strict';

import { Router } from 'express';
import { getLowStockAlerts, getOutOfStockAlerts } from './alerts.controller.js';
import { validateJWT } from '../middleware/validateJWT.js';

const router = Router();

// GET /api/v1/alerts/low-stock
router.get('/low-stock', validateJWT, getLowStockAlerts);

// GET /api/v1/alerts/out-of-stock
router.get('/out-of-stock', validateJWT, getOutOfStockAlerts);

export default router;