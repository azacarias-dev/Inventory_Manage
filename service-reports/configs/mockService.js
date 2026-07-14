'use strict';

export const getMockProducts = () => {
    return [
        { _id: '1', nombre: 'Laptop HP', categoria: 'Electrónica', existencia: 3, precio: 899.99 },
        { _id: '2', nombre: 'Mouse Logitech', categoria: 'Electrónica', existencia: 0, precio: 25.50 },
        { _id: '3', nombre: 'Silla de oficina', categoria: 'Mobiliario', existencia: 12, precio: 150.00 },
        { _id: '4', nombre: 'Monitor LG 24"', categoria: 'Electrónica', existencia: 5, precio: 210.00 },
        { _id: '5', nombre: 'Escritorio', categoria: 'Mobiliario', existencia: 0, precio: 300.00 }
    ];
};