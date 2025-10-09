const express = require('express');
const router = express.Router();
const {
    getAllEquipos,
    getEquipoById,
    getEquiposByEstado,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    asignarEquipo,
    liberarEquipo
} = require('../controllers/equiposController');

// GET /api/equipos - Obtener todos los equipos
router.get('/', getAllEquipos);

// GET /api/equipos/estado/:estado - Obtener equipos por estado
router.get('/estado/:estado', getEquiposByEstado);

// GET /api/equipos/:id - Obtener equipo por ID
router.get('/:id', getEquipoById);

// POST /api/equipos - Crear nuevo equipo
router.post('/', createEquipo);

// PUT /api/equipos/:id - Actualizar equipo
router.put('/:id', updateEquipo);

// DELETE /api/equipos/:id - Eliminar equipo
router.delete('/:id', deleteEquipo);

// POST /api/equipos/:id/asignar - Asignar equipo a empleado
router.post('/:id/asignar', asignarEquipo);

// POST /api/equipos/:id/liberar - Liberar equipo
router.post('/:id/liberar', liberarEquipo);

module.exports = router;