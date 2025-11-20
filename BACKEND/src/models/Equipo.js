const db = require('../config/database');

class Equipo {
    // Obtener todos los equipos
    static getAll(callback) {
        const sql = `
            SELECT e.*, emp.nombre || ' ' || emp.apellido as empleado_nombre
            FROM equipos e
            LEFT JOIN empleados emp ON e.empleado_id = emp.id
            ORDER BY e.tipo, e.marca
        `;
        db.all(sql, [], callback);
    }

    // Obtener equipo por ID
    static getById(id, callback) {
        const sql = `
            SELECT e.*, emp.nombre || ' ' || emp.apellido as empleado_nombre
            FROM equipos e
            LEFT JOIN empleados emp ON e.empleado_id = emp.id
            WHERE e.id = ?
        `;
        db.get(sql, [id], callback);
    }

    // Obtener equipos por estado
    static getByEstado(estado, callback) {
        const sql = `
            SELECT e.*, emp.nombre || ' ' || emp.apellido as empleado_nombre
            FROM equipos e
            LEFT JOIN empleados emp ON e.empleado_id = emp.id
            WHERE e.estado = ?
            ORDER BY e.tipo, e.marca
        `;
        db.all(sql, [estado], callback);
    }

    // Crear nuevo equipo
    static create(equipoData, callback) {
        const sql = `
            INSERT INTO equipos 
            (tipo, marca, modelo, numero_serial, estado, ubicacion) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            equipoData.tipo,
            equipoData.marca,
            equipoData.modelo,
            equipoData.numero_serial,
            equipoData.estado || 'Disponible',
            equipoData.ubicacion || 'Almacen General' // Usar 'Almacen General' como default
        ];

        db.run(sql, params, function(err) {
            callback(err, { id: this.lastID });
        });
    }

    // Actualizar equipo
    static update(id, equipoData, callback) {
        const sql = `
            UPDATE equipos SET 
            tipo = ?, marca = ?, modelo = ?, numero_serial = ?,
            estado = ?, ubicacion = ?, empleado_id = ?,
            fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        const params = [
            equipoData.tipo,
            equipoData.marca,
            equipoData.modelo,
            equipoData.numero_serial,
            equipoData.estado,
            // Asignar 'Almacen General' si se libera manualmente
            equipoData.ubicacion || (equipoData.empleado_id ? null : 'Almacen General'),
            equipoData.empleado_id || null, 
            id
        ];

        db.run(sql, params, callback);
    }

    // Eliminar equipo
    static delete(id, callback) {
        const sql = `DELETE FROM equipos WHERE id = ?`;
        db.run(sql, [id], callback);
    }

    // ASIGNAR EQUIPO A EMPLEADO (MODIFICADO: Obtiene la ubicación del departamento del empleado)
    static asignar(equipoId, empleadoId, callback) {
        const sql = `
            UPDATE equipos SET 
            empleado_id = ?,
            estado = 'Asignado',
            ubicacion = (SELECT departamento FROM empleados WHERE id = ?), 
            fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        db.run(sql, [empleadoId, empleadoId, equipoId], callback);
    }

    // LIBERAR EQUIPO (MODIFICADO: Establece la ubicación a 'Almacen General')
    static liberar(equipoId, callback) {
        const sql = `
            UPDATE equipos SET 
            empleado_id = NULL,
            estado = 'Disponible',
            ubicacion = 'Almacen General', // 'Almacen General' por solicitud
            fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        db.run(sql, [equipoId], callback);
    }
}

module.exports = Equipo;
