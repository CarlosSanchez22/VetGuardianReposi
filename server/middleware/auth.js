import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Importamos la clave secreta

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
    // El token se espera en el header 'Authorization' como 'Bearer TOKEN'
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: "No se proporcionó token de autenticación." });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de 'Bearer '

    if (!token) {
        return res.status(403).json({ message: "Formato de token inválido." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Si el token es inválido o ha expirado
            console.error("Error al verificar token JWT:", err.message);
            return res.status(401).json({ message: "Token no autorizado o expirado." });
        }
        // Si el token es válido, adjuntamos la información del usuario al objeto de solicitud
        // Esto incluirá el id_usuario y el role que se guardaron en el token
        req.user = user; 
        next(); // Continuar con la siguiente función middleware o controlador
    });
};

// Middleware para verificar si el usuario tiene rol de administrador
export const isAdmin = (req, res, next) => {
    // req.user debe haber sido adjuntado por verifyToken
    if (req.user && req.user.role === 'admin') {
        next(); // El usuario es administrador, continuar
    } else {
        return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
    }
};