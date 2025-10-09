const db = require('../config/database');

class Asignacion {
    // Obtener todo el historial
    static getAll(callback) {
        const sql = `
            SELECT 
                ha.*,
                e.tipo, e.marca, e.modelo, e.numero_serial,
                emp_ant.nombre || ' ' || emp_ant.apellido as empleado_anterior_nombre,
                emp_nue.nombre || ' ' || emp_nue.apellido as empleado_nuevo_nombre,
                admin.nombre || ' ' || admin.apellido as administrador_nombre
            FROM historial_asignaciones ha
            LEFT JOIN equipos e ON ha.equipo_id = e.id
            LEFT JOIN empleados emp_ant ON ha.empleado_id_anterior = emp_ant.id
            LEFT JOIN empleados emp_nue ON ha.empleado_id_nuevo = emp_nue.id
            LEFT JOIN empleados admin ON ha.administrador_id = admin.id
            ORDER BY ha.fecha_cambio DESC
        `;
        db.all(sql, [], callback);
    }

    // Obtener historial por equipo
    static getByEquipo(equipoId, callback) {
        const sql = `
            SELECT 
                ha.*,
                e.tipo, e.marca, e.modelo, e.numero_serial,
                emp_ant.nombre || ' ' || emp_ant.apellido as empleado_anterior_nombre,
                emp_nue.nombre || ' ' || emp_nue.apellido as empleado_nuevo_nombre,
                admin.nombre || ' ' || admin.apellido as administrador_nombre
            FROM historial_asignaciones ha
            LEFT JOIN equipos e ON ha.equipo_id = e.id
            LEFT JOIN empleados emp_ant ON ha.empleado_id_anterior = emp_ant.id
            LEFT JOIN empleados emp_nue ON ha.empleado_id_nuevo = emp_nue.id
            LEFT JOIN empleados admin ON ha.administrador_id = admin.id
            WHERE ha.equipo_id = ?
            ORDER BY ha.fecha_cambio DESC
        `;
        db.all(sql, [equipoId], callback);
    }

    // Obtener historial por empleado
    static getByEmpleado(empleadoId, callback) {
        const sql = `
            SELECT 
                ha.*,
                e.tipo, e.marca, e.modelo, e.numero_serial,
                emp_ant.nombre || ' ' || emp_ant.apellido as empleado_anterior_nombre,
                emp_nue.nombre || ' ' || emp_nue.apellido as empleado_nuevo_nombre,
                admin.nombre || ' ' || admin.apellido as administrador_nombre
            FROM historial_asignaciones ha
            LEFT JOIN equipos e ON ha.equipo_id = e.id
            LEFT JOIN empleados emp_ant ON ha.empleado_id_anterior = emp_ant.id
            LEFT JOIN empleados emp_nue ON ha.empleado_id_nuevo = emp_nue.id
            LEFT JOIN empleados admin ON ha.administrador_id = admin.id
            WHERE ha.empleado_id_anterior = ? OR ha.empleado_id_nuevo = ?
            ORDER BY ha.fecha_cambio DESC
        `;
        db.all(sql, [empleadoId, empleadoId], callback);
    }

    // Registrar nueva asignación
    static crearAsignacion(asignacionData, callback) {
        const sql = `
            INSERT INTO historial_asignaciones 
            (equipo_id, empleado_id_anterior, empleado_id_nuevo, administrador_id, observaciones) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const params = [
            asignacionData.equipo_id,
            asignacionData.empleado_id_anterior || null,
            asignacionData.empleado_id_nuevo,
            asignacionData.administrador_id,
            asignacionData.observaciones || null
        ];

        db.run(sql, params, function(err) {
            callback(err, { id: this.lastID });
        });
    }

    // Obtener estadísticas
    static getEstadisticas(callback) {
        const sql = `
            SELECT 
                COUNT(*) as total_asignaciones,
                COUNT(DISTINCT equipo_id) as equipos_involucrados,
                COUNT(DISTINCT empleado_id_nuevo) as empleados_involucrados,
                MIN(fecha_cambio) as primera_asignacion,
                MAX(fecha_cambio) as ultima_asignacion
            FROM historial_asignaciones
        `;
        db.get(sql, [], callback);
    }
}

module.exports = Asignacion;