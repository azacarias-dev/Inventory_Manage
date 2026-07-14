'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './cors-configuration.js';
import { dbConnection } from './db.js';
import alertsRoutes from '../src/Alerts/alerts.routes.js';
import reportsRoutes from '../src/Reports/reports.routes.js';

const BASE_URL = '/api/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use(`${BASE_URL}/alerts`, alertsRoutes);
    app.use(`${BASE_URL}/reports`, reportsRoutes);
};

const initServer = async (app) => {
    app = express();
    const PORT = process.env.PORT || 3001;

    try {
        dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`);
        });

        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json({
                status: 'ok',
                service: 'Servicio B de Alertas y Reportes',
                version: '1.0.0'
            });
        });
    } catch (error) {
        console.log(error);
    }
};

export { initServer };