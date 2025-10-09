const Equipo = require('../models/Equipo');

// Obtener todos los equipos
const getAllEquipos = (req, res) => {
    Equipo.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener equipos',
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

// Obtener equipo por ID
const getEquipoById = (req, res) => {
    const { id } = req.params;
    
    Equipo.getById(id, (err, row) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener equipo',
                details: err.message
            });
        }
        
        if (!row) {
            return res.status(404).json({
                error: 'Equipo no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: row
        });
    });
};

// Obtener equipos por estado
const getEquiposByEstado = (req, res) => {
    const { estado } = req.params;
    
    const estadosPermitidos = ['Disponible', 'Asignado', 'Mantenimiento', 'Baja'];
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            error: 'Estado no válido',
            estados_permitidos: estadosPermitidos
        });
    }
    
    Equipo.getByEstado(estado, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener equipos',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            data: rows,
            total: rows.length,
            estado: estado
        });
    });
};

// Crear nuevo equipo
const createEquipo = (req, res) => {
    const { tipo, marca, modelo, numero_serial, estado, ubicacion, empleado_id } = req.body;
    
    if (!tipo || !numero_serial) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios',
            required: ['tipo', 'numero_serial']
        });
    }
    
    const equipoData = {
        tipo,
        marca: marca || null,
        modelo: modelo || null,
        numero_serial,
        estado: estado || 'Disponible',
        ubicacion: ubicacion || null,
        empleado_id: empleado_id || null
    };
    
    Equipo.create(equipoData, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al crear equipo',
                details: err.message
            });
        }
        
        res.status(201).json({
            success: true,
            message: 'Equipo creado exitosamente',
            data: { id: result.id, ...equipoData }
        });
    });
};

// Actualizar equipo
const updateEquipo = (req, res) => {
    const { id } = req.params;
    const { tipo, marca, modelo, numero_serial, estado, ubicacion, empleado_id } = req.body;
    
    const equipoData = {
        tipo,
        marca,
        modelo,
        numero_serial,
        estado,
        ubicacion,
        empleado_id
    };
    
    Equipo.update(id, equipoData, function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al actualizar equipo',
                details: err.message
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Equipo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Equipo actualizado exitosamente',
            data: { id: parseInt(id), ...equipoData }
        });
    });
};

// Eliminar equipo
const deleteEquipo = (req, res) => {
    const { id } = req.params;
    
    Equipo.delete(id, function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al eliminar equipo',
                details: err.message
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Equipo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Equipo eliminado exitosamente'
        });
    });
};

// Asignar equipo a empleado
const asignarEquipo = (req, res) => {
    const { id } = req.params;
    const { empleado_id } = req.body;
    
    if (!empleado_id) {
        return res.status(400).json({
            error: 'Se requiere empleado_id'
        });
    }
    
    Equipo.asignar(id, empleado_id, function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al asignar equipo',
                details: err.message
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Equipo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Equipo asignado exitosamente'
        });
    });
};

// Liberar equipo
const liberarEquipo = (req, res) => {
    const { id } = req.params;
    
    Equipo.liberar(id, function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al liberar equipo',
                details: err.message
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Equipo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Equipo liberado exitosamente'
        });
    });
};

module.exports = {
    getAllEquipos,
    getEquipoById,
    getEquiposByEstado,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    asignarEquipo,
    liberarEquipo
};