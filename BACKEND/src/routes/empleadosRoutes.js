const express = require('express');
const router = express.Router();
const {
    getAllEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getEmpleadosByDepartamento
} = require('../controllers/empleadosController');

// GET /api/empleados - Obtener todos los empleados
router.get('/', getAllEmpleados);

// GET /api/empleados/departamento/:departamento - Obtener por departamento
router.get('/departamento/:departamento', getEmpleadosByDepartamento);

// GET /api/empleados/:id - Obtener empleado por ID
router.get('/:id', getEmpleadoById);

// POST /api/empleados - Crear nuevo empleado
router.post('/', createEmpleado);

// PUT /api/empleados/:id - Actualizar empleado
router.put('/:id', updateEmpleado);

// DELETE /api/empleados/:id - Eliminar empleado
router.delete('/:id', deleteEmpleado);

module.exports = router;