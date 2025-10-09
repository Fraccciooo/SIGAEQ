const express = require('express');
const router = express.Router();
const {
    getAllAsignaciones,
    getAsignacionesByEquipo,
    getAsignacionesByEmpleado,
    createAsignacion,
    getEstadisticas
} = require('../controllers/asignacionesController');

// GET /api/asignaciones - Obtener todo el historial
router.get('/', getAllAsignaciones);

// GET /api/asignaciones/estadisticas - Obtener estadísticas
router.get('/estadisticas', getEstadisticas);

// GET /api/asignaciones/equipo/:equipoId - Obtener historial por equipo
router.get('/equipo/:equipoId', getAsignacionesByEquipo);

// GET /api/asignaciones/empleado/:empleadoId - Obtener historial por empleado
router.get('/empleado/:empleadoId', getAsignacionesByEmpleado);

// POST /api/asignaciones - Registrar nueva asignación
router.post('/', createAsignacion);

module.exports = router;