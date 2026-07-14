'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './cors-configuration.js';
import { dbConnection } from './db.js';
import categoriasRoutes from '../src/Categoria/Categoria.router.js';
import productosRoutes from '../src/Productos/Productos.router.js';
import movimientosRoutes from '../src/MovimientosInventario/MovimientosInventario.router.js';
const BASE_URL = '/service-inventory/v1/inventory';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use(`${BASE_URL}/categorias`, categoriasRoutes);
    app.use(`${BASE_URL}/productos`, productosRoutes);
    app.use(`${BASE_URL}/movimientosInventario`, movimientosRoutes);
}

const initServer = async (app) => {
    app = express();
    const PORT = process.env.PORT || 3002;

    try {
        dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`)
        });

        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json(
                {
                    status: 'ok',
                    service: 'Inventory Manage Admin',
                    version: '1.0.0'
                }
            );
        });

    } catch (error) {
        console.log(error);
    }
}

export { initServer };