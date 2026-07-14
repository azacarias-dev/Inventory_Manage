'use strict';

import axios from 'axios';
import { getMockProducts } from '../../configs/mockService.js';

const SERVICE_A_URL = 'http://localhost:3002/api/v1'; // Puerto de service-inventory

const getProductsFromServiceA = async (token) => {
    if (process.env.NODE_ENV === 'development') {
        try {
            const response = await axios.get(`${SERVICE_A_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 2000
            });
            return response.data.productos || [];
        } catch (error) {
            console.log('⚠️  Servicio A no disponible, usando datos mock...');
            return getMockProducts();
        }
    } else {
        const response = await axios.get(`${SERVICE_A_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.productos || [];
    }
};

export const getLowStockAlerts = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const products = await getProductsFromServiceA(token);

        const lowStockProducts = products.filter(product => product.existencia <= 5);

        const alerts = lowStockProducts.map(product => ({
            productId: product._id,
            name: product.nombre,
            category: product.categoria,
            currentStock: product.existencia,
            price: product.precio,
            alertLevel: 'LOW_STOCK',
            severity: product.existencia === 0 ? 'CRITICAL' : 'WARNING'
        }));

        res.status(200).json({
            success: true,
            total: alerts.length,
            alerts
        });

    } catch (error) {
        console.error('Error en getLowStockAlerts:', error.message);

        if (error.response?.status === 401) {
            return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener alertas de bajo inventario',
            error: error.message
        });
    }
};

export const getOutOfStockAlerts = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const products = await getProductsFromServiceA(token);

        const outOfStockProducts = products.filter(product => product.existencia === 0);

        const alerts = outOfStockProducts.map(product => ({
            productId: product._id,
            name: product.nombre,
            category: product.categoria,
            currentStock: product.existencia,
            price: product.precio,
            alertLevel: 'OUT_OF_STOCK',
            severity: 'CRITICAL'
        }));

        res.status(200).json({
            success: true,
            total: alerts.length,
            alerts
        });

    } catch (error) {
        console.error('Error en getOutOfStockAlerts:', error.message);

        if (error.response?.status === 401) {
            return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener alertas de productos agotados',
            error: error.message
        });
    }
};