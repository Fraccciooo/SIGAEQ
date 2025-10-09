const Asignacion = require('../models/Asignacion');

// Obtener todo el historial
const getAllAsignaciones = (req, res) => {
    Asignacion.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener historial de asignaciones',
                details: err.message
            });
        }
        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    });
};

// Obtener historial por equipo
const getAsignacionesByEquipo = (req, res) => {
    const { equipoId } = req.params;
    
    Asignacion.getByEquipo(equipoId, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener historial del equipo',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            data: rows,
            total: rows.length,
            equipo_id: parseInt(equipoId)
        });
    });
};

// Obtener historial por empleado
const getAsignacionesByEmpleado = (req, res) => {
    const { empleadoId } = req.params;
    
    Asignacion.getByEmpleado(empleadoId, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener historial del empleado',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            data: rows,
            total: rows.length,
            empleado_id: parseInt(empleadoId)
        });
    });
};

// Crear nueva asignación
const createAsignacion = (req, res) => {
    const { equipo_id, empleado_id_anterior, empleado_id_nuevo, administrador_id, observaciones } = req.body;
    
    if (!equipo_id || !empleado_id_nuevo || !administrador_id) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios',
            required: ['equipo_id', 'empleado_id_nuevo', 'administrador_id']
        });
    }
    
    const asignacionData = {
        equipo_id,
        empleado_id_anterior: empleado_id_anterior || null,
        empleado_id_nuevo,
        administrador_id,
        observaciones: observaciones || null
    };
    
    Asignacion.crearAsignacion(asignacionData, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al registrar asignación',
                details: err.message
            });
        }
        
        res.status(201).json({
            success: true,
            message: 'Asignación registrada exitosamente',
            data: { id: result.id, ...asignacionData }
        });
    });
};

// Obtener estadísticas
const getEstadisticas = (req, res) => {
    Asignacion.getEstadisticas((err, stats) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener estadísticas',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            data: stats
        });
    });
};

module.exports = {
    getAllAsignaciones,
    getAsignacionesByEquipo,
    getAsignacionesByEmpleado,
    createAsignacion,
    getEstadisticas
};