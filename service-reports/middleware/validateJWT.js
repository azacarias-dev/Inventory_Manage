'use strict';

import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer token"
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token no proporcionado' 
            });
        }

        // Usa la misma clave secreta que el Servicio A
        const decoded = jwt.verify(token, 'tu-clave-secreta');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token inválido o expirado',
            error: error.message
        });
    }
};