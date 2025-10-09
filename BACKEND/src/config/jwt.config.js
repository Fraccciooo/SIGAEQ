const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'sigaeq_secret_key_2025',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

// Generar token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_CONFIG.secret, { 
        expiresIn: JWT_CONFIG.expiresIn 
    });
};

// Verificar token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Token de acceso requerido'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: error.message
        });
    }
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'Administrador') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            error: 'Se requieren privilegios de administrador'
        });
    }
};

module.exports = {
    JWT_CONFIG,
    generateToken,
    verifyToken,
    authenticateToken,
    requireAdmin
};