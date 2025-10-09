const Empleado = require('../models/Empleado');

// Obtener todos los empleados
const getAllEmpleados = (req, res) => {
    Empleado.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener empleados',
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

// Obtener empleado por ID
const getEmpleadoById = (req, res) => {
    const { id } = req.params;
    
    Empleado.getById(id, (err, row) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener empleado',
                details: err.message
            });
        }
        
        if (!row) {
            return res.status(404).json({
                error: 'Empleado no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: row
        });
    });
};

// Crear nuevo empleado
const createEmpleado = (req, res) => {
    const { cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo } = req.body;
    
    // Validaciones básicas
    if (!cedula || !nombre || !apellido || !cargo || !fecha_ingreso || !correo) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios',
            required: ['cedula', 'nombre', 'apellido', 'cargo', 'fecha_ingreso', 'correo']
        });
    }
    
    const empleadoData = {
        cedula,
        nombre,
        apellido,
        cargo,
        fecha_ingreso,
        departamento: departamento || null,
        correo
    };
    
    Empleado.create(empleadoData, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al crear empleado',
                details: err.message
            });
        }
        
        res.status(201).json({
            success: true,
            message: 'Empleado creado exitosamente',
            data: { id: result.id, ...empleadoData }
        });
    });
};

// Actualizar empleado
const updateEmpleado = (req, res) => {
    const { id } = req.params;
    const { cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo } = req.body;
    
    const empleadoData = {
        cedula,
        nombre,
        apellido,
        cargo,
        fecha_ingreso,
        departamento,
        correo
    };
    
    Empleado.update(id, empleadoData, function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al actualizar empleado',
                details: err.message
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Empleado no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Empleado actualizado exitosamente',
            data: { id: parseInt(id), ...empleadoData }
        });
    });
};

// Eliminar empleado
const deleteEmpleado = (req, res) => {
    const { id } = req.params;
    
    Empleado.delete(id, function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Error al eliminar empleado',
                details: err.message
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Empleado no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Empleado eliminado exitosamente'
        });
    });
};

// Obtener empleados por departamento
const getEmpleadosByDepartamento = (req, res) => {
    const { departamento } = req.params;
    
    Empleado.getByDepartamento(departamento, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener empleados',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            data: rows,
            total: rows.length,
            departamento: departamento
        });
    });
};

module.exports = {
    getAllEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getEmpleadosByDepartamento
};