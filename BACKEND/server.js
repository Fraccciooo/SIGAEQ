const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas - VERIFICAR QUE ESTÁN TODAS
const empleadosRoutes = require('./src/routes/empleadosRoutes');
const equiposRoutes = require('./src/routes/equiposRoutes');
const asignacionesRoutes = require('./src/routes/asignacionesRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas básicas
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API SIGAEQ - Sistema de Gestión de Equipos',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            empleados: '/api/empleados',
            equipos: '/api/equipos',
            asignaciones: '/api/asignaciones'
        }
    });
});

// Rutas de la API - VERIFICAR QUE ESTÁN TODAS
app.use('/api/empleados', empleadosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/auth', authRoutes); // ← ESTA LÍNEA DEBE ESTAR

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('💥 Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Documentación API disponible en http://localhost:${PORT}/`);
});

module.exports = app;