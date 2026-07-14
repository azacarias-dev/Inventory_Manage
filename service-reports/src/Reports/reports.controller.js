'use strict';

import axios from 'axios';
import { getMockProducts } from '../../configs/mockService.js';

// URL del Servicio A
const SERVICE_A_URL = 'http://localhost:3002/api/v1';

// Función auxiliar para obtener datos del Servicio A
const getServiceAData = async (endpoint, token) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            try {
                const response = await axios.get(`${SERVICE_A_URL}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    timeout: 2000
                });
                return response.data;
            } catch (error) {
                console.log(`⚠️  Servicio A no disponible para ${endpoint}, usando datos mock...`);
                if (endpoint === '/productos') {
                    return { productos: getMockProducts() };
                }
                return { movimientos: [] };
            }
        } else {
            const response = await axios.get(`${SERVICE_A_URL}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
    } catch (error) {
        throw error;
    }
};

// GET /api/v1/reports/top-products - Productos más vendidos (más salidas)
export const getTopProducts = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        // Obtener movimientos del Servicio A
        const movimientosData = await getServiceAData('/movimientos-inventario', token);
        const movimientos = movimientosData.movimientos || [];

        // Filtrar solo las salidas
        const salidas = movimientos.filter(mov => mov.tipo === 'SALIDA');

        if (salidas.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay movimientos de salida registrados',
                topProducts: []
            });
        }

        // Agrupar por producto y sumar cantidades
        const productosMap = new Map();
        salidas.forEach(salida => {
            const productId = salida.producto;
            if (productosMap.has(productId)) {
                productosMap.get(productId).totalVendido += salida.cantidad;
            } else {
                productosMap.set(productId, {
                    productId,
                    totalVendido: salida.cantidad
                });
            }
        });

        // Obtener productos para completar información
        const productosData = await getServiceAData('/productos', token);
        const productos = productosData.productos || [];

        // Mapear con información de productos
        const topProducts = Array.from(productosMap.values())
            .map(item => {
                const producto = productos.find(p => p._id === item.productId);
                return {
                    productId: item.productId,
                    name: producto?.nombreProducto || 'Producto desconocido',
                    category: producto?.categoria,
                    price: producto?.precio || 0,
                    totalSold: item.totalVendido
                };
            })
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 10); // Top 10

        res.status(200).json({
            success: true,
            total: topProducts.length,
            topProducts
        });

    } catch (error) {
        console.error('Error en getTopProducts:', error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener productos más vendidos',
            error: error.message
        });
    }
};

// GET /api/v1/reports/categories - Resumen por categoría
export const getCategoriesSummary = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        // Obtener productos del Servicio A
        const productosData = await getServiceAData('/productos', token);
        const productos = productosData.productos || [];

        if (productos.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay productos registrados',
                categories: []
            });
        }

        // Agrupar por categoría
        const categoriesMap = new Map();
        productos.forEach(producto => {
            const categoryId = producto.categoria;
            if (categoriesMap.has(categoryId)) {
                const cat = categoriesMap.get(categoryId);
                cat.productCount += 1;
                cat.totalStock += producto.existencia;              // ← corregido
                cat.totalValue += producto.precio * producto.existencia; // ← corregido
            } else {
                categoriesMap.set(categoryId, {
                    categoryId,
                    productCount: 1,
                    totalStock: producto.existencia,                 // ← corregido
                    totalValue: producto.precio * producto.existencia // ← corregido
                });
            }
        });

        const categories = Array.from(categoriesMap.values())
            .map(cat => ({
                categoryId: cat.categoryId,
                productCount: cat.productCount,
                totalStock: cat.totalStock,
                totalValue: cat.totalValue.toFixed(2)
            }))
            .sort((a, b) => b.productCount - a.productCount);

        res.status(200).json({
            success: true,
            total: categories.length,
            categories
        });

    } catch (error) {
        console.error('Error en getCategoriesSummary:', error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener resumen de categorías',
            error: error.message
        });
    }
};

// GET /api/v1/reports/summary - Resumen general del inventario
export const getInventorySummary = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        // Obtener productos y movimientos
        const productosData = await getServiceAData('/productos', token);
        const movimientosData = await getServiceAData('/movimientos-inventario', token);
        
        const productos = productosData.productos || [];
        const movimientos = movimientosData.movimientos || [];

        // Calcular estadísticas
        const totalProducts = productos.length;
        const totalStock = productos.reduce((sum, p) => sum + p.existencia, 0);
        const outOfStock = productos.filter(p => p.existencia === 0).length;
        const availableProducts = totalProducts - outOfStock;
        const totalInventoryValue = productos.reduce((sum, p) => sum + (p.precio * p.existencia), 0);
        
        const totalMovements = movimientos.length;
        const totalInflows = movimientos
            .filter(m => m.tipo === 'INGRESO')
            .reduce((sum, m) => sum + m.cantidad, 0);
        const totalOutflows = movimientos
            .filter(m => m.tipo === 'SALIDA')
            .reduce((sum, m) => sum + m.cantidad, 0);

        res.status(200).json({
            success: true,
            summary: {
                products: {
                    total: totalProducts,
                    available: availableProducts,
                    outOfStock: outOfStock
                },
                inventory: {
                    totalStock: totalStock,
                    totalValue: totalInventoryValue.toFixed(2)
                },
                movements: {
                    total: totalMovements,
                    totalInflows: totalInflows,
                    totalOutflows: totalOutflows,
                    netMovement: totalInflows - totalOutflows
                }
            }
        });

    } catch (error) {
        console.error('Error en getInventorySummary:', error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener resumen de inventario',
            error: error.message
        });
    }
};