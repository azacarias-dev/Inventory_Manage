'use strict';

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Endpoints de reportes próximamente'
    });
});

export default router;