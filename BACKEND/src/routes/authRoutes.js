const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../config/jwt.config');

// POST /api/auth/login - Login de usuario
router.post('/login', login);

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, getMe);

// POST /api/auth/register - Registrar nuevo usuario (solo admin)
router.post('/register', authenticateToken, requireAdmin, register);

module.exports = router;