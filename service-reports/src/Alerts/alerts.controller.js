'use strict';

import axios from 'axios';

const SERVICE_A_URL = 'http://localhost:3001/api/v1';

export const getLowStockAlerts = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const response = await axios.get(`${SERVICE_A_URL}/products`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const products = response.data.productos || [];

        const lowStockProducts = products.filter(product => product.existencia <= 5);

        if (lowStockProducts.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay productos con bajo inventario',
                alerts: []
            });
        }

        // Procesar y retornar las alertas
        const alerts = lowStockProducts.map(product => ({
            productId: product._id,
            name: product.nombre,
            category: product.categoría,
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
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener alertas de bajo inventario',
            error: error.message
        });
    }
};