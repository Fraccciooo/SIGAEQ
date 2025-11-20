const Asignacion = require('../models/Asignacion');
const Equipo = require('../models/Equipo'); // Importar el modelo Equipo

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

// Registrar nueva asignación (MODIFICADO: Agrega cascada UP)
const createAsignacion = (req, res) => {
    const { equipo_id, empleado_id_anterior, empleado_id_nuevo, administrador_id, observaciones } = req.body;
    
    if (!equipo_id || !empleado_id_nuevo || !administrador_id) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios',
            required: ['equipo_id', 'empleado_id_nuevo', 'administrador_id']
        });
    }
    
    const asignacionData = {
        equipo_id: parseInt(equipo_id),
        empleado_id_anterior: empleado_id_anterior ? parseInt(empleado_id_anterior) : null,
        empleado_id_nuevo: parseInt(empleado_id_nuevo),
        administrador_id: parseInt(administrador_id),
        observaciones: observaciones || null
    };
    
    Asignacion.crearAsignacion(asignacionData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al registrar asignación', details: err.message });
        }
        
        // CASCADA 1: Actualizar el estado del equipo
        Equipo.asignar(asignacionData.equipo_id, asignacionData.empleado_id_nuevo, (err) => {
            if (err) {
                // Loguear error de actualización, pero no fallar el registro de historial
                console.error("Error al actualizar estado del equipo después de la asignación:", err);
            }
            
            res.status(201).json({
                success: true,
                message: 'Asignación registrada y equipo actualizado exitosamente',
                data: { id: result.id, ...asignacionData }
            });
        });
    });
};

// Eliminar asignación (MODIFICADO: Agrega cascada DOWN)
const deleteAsignacion = (req, res) => {
    const { id } = req.params;
    let equipoIdToDelete; 

    // Paso 1: Obtener el equipo_id antes de eliminar el registro
    Asignacion.getById(id, (err, asignacion) => { 
        if (err || !asignacion) {
            return res.status(404).json({ error: 'Registro de asignación no encontrado o error al obtenerlo' });
        }
        equipoIdToDelete = asignacion.equipo_id;

        // Paso 2: Eliminar el registro del historial
        Asignacion.delete(id, (err, changes) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el registro de asignación', details: err.message });
            }
            if (changes === 0) {
                 return res.status(404).json({ error: 'Registro de asignación no encontrado' });
            }
            
            // Paso 3: CASCADA 2: Determinar el nuevo estado del equipo
            Asignacion.getLatestByEquipo(equipoIdToDelete, (err, latestAssignment) => {
                if (err) {
                    console.error("Error al buscar la última asignación:", err);
                    return res.status(200).json({ success: true, message: 'Registro eliminado. Error al actualizar estado del equipo.' });
                }

                if (latestAssignment) {
                    // Hay asignaciones restantes: re-asignar el equipo con la última asignación
                    Equipo.asignar(equipoIdToDelete, latestAssignment.empleado_id_nuevo, (err) => {
                        if(err) console.error("Error al re-asignar el equipo:", err);
                        res.status(200).json({ success: true, message: 'Registro de asignación eliminado y equipo re-asignado al empleado anterior.' });
                    });
                } else {
                    // No hay asignaciones restantes: liberar el equipo (Almacen General)
                    Equipo.liberar(equipoIdToDelete, (err) => {
                        if(err) console.error("Error al liberar el equipo:", err);
                        res.status(200).json({ success: true, message: 'Registro de asignación eliminado y equipo liberado (Almacen General).' });
                    });
                }
            });
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

// NUEVA FUNCIÓN: Asignación Masiva
const createAsignacionMasiva = async (req, res) => {
    const { equipos_ids, empleado_id_nuevo, administrador_id, observaciones } = req.body;

    if (!equipos_ids || !Array.isArray(equipos_ids) || equipos_ids.length === 0 || !empleado_id_nuevo || !administrador_id) {
        return res.status(400).json({
            error: 'Datos incompletos. Se requieren equipos y un empleado.'
        });
    }

    try {
        const resultados = [];

        // Procesamos cada equipo secuencialmente usando Promesas para manejar los callbacks
        for (const equipo_id of equipos_ids) {
            await new Promise((resolve, reject) => {
                const asignacionData = {
                    equipo_id: parseInt(equipo_id),
                    empleado_id_anterior: null,
                    empleado_id_nuevo: parseInt(empleado_id_nuevo),
                    administrador_id: parseInt(administrador_id),
                    observaciones: observaciones || 'Asignación Masiva'
                };

                // 1. Crear registro en historial
                Asignacion.crearAsignacion(asignacionData, (err, result) => {
                    if (err) {
                        console.error(`Error asignando equipo ${equipo_id}:`, err);
                        resolve(); // Resolvemos aunque falle para no detener el proceso
                    } else {
                        // 2. Actualizar estado del equipo
                        Equipo.asignar(asignacionData.equipo_id, asignacionData.empleado_id_nuevo, (errUpdate) => {
                            if (errUpdate) console.error(`Error actualizando equipo ${equipo_id}`);
                            resultados.push(equipo_id);
                            resolve();
                        });
                    }
                });
            });
        }

        res.status(201).json({
            success: true,
            message: `Se procesaron ${resultados.length} asignaciones exitosamente.`,
            data: { asignados: resultados }
        });

    } catch (error) {
        console.error('Error en asignación masiva:', error);
        res.status(500).json({ error: 'Error interno al procesar asignaciones masivas' });
    }
};

module.exports = {
    getAllAsignaciones,
    getAsignacionesByEquipo,
    getAsignacionesByEmpleado,
    createAsignacion,
    createAsignacionMasiva,
    getEstadisticas,
    deleteAsignacion
};