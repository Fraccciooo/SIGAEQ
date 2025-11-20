const db = require('../config/database');

class Empleado {
    // Obtener todos los empleados
    static getAll(callback) {
        const sql = `
            SELECT * FROM empleados 
            WHERE activo = 1 
            ORDER BY nombre, apellido
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error en getAll:', err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    // Obtener empleado por ID
    static getById(id, callback) {
        const sql = `SELECT * FROM empleados WHERE id = ? AND activo = 1`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('Error en getById:', err);
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    // Obtener empleado por cédula
    static getByCedula(cedula, callback) {
        const sql = `SELECT * FROM empleados WHERE cedula = ? AND activo = 1`;
        db.get(sql, [cedula], (err, row) => {
            if (err) {
                console.error('Error en getByCedula:', err);
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    // Obtener empleado por correo
    static getByCorreo(correo, callback) {
        const sql = `SELECT * FROM empleados WHERE correo = ? AND activo = 1`;
        db.get(sql, [correo], (err, row) => {
            if (err) {
                console.error('Error en getByCorreo:', err);
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    // Crear nuevo empleado
    static create(empleadoData, callback) {
        console.log('Creando empleado con datos:', empleadoData);
        
        const sql = `
            INSERT INTO empleados 
            (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            empleadoData.cedula,
            empleadoData.nombre,
            empleadoData.apellido,
            empleadoData.cargo,
            empleadoData.fecha_ingreso,
            empleadoData.departamento || '',
            empleadoData.correo
        ];

        console.log('Ejecutando SQL:', sql, 'con parámetros:', params);

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error en create:', err);
                callback(err, null);
            } else {
                console.log('Empleado creado con ID:', this.lastID);
                callback(null, { id: this.lastID });
            }
        });
    }

    // Actualizar empleado
    static update(id, empleadoData, callback) {
        const sql = `
            UPDATE empleados SET 
            cedula = ?, nombre = ?, apellido = ?, cargo = ?, 
            fecha_ingreso = ?, departamento = ?, correo = ?,
            fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        const params = [
            empleadoData.cedula,
            empleadoData.nombre,
            empleadoData.apellido,
            empleadoData.cargo,
            empleadoData.fecha_ingreso,
            empleadoData.departamento || '',
            empleadoData.correo,
            id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error en update:', err);
                callback(err);
            } else {
                callback(null, this.changes);
            }
        });
    }

// Eliminar empleado (borrado lógico) Y liberar sus equipos
    static delete(id, callback) {
        // PASO 1: Liberar equipos asignados a este empleado
        const sqlEquipos = `
            UPDATE equipos SET 
            estado = 'Disponible', 
            ubicacion = 'Almacen General', 
            empleado_id = NULL,
            fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE empleado_id = ?
        `;

        // Ejecutamos primero la liberación de equipos
        db.run(sqlEquipos, [id], function(errEquipos) {
            if (errEquipos) {
                console.error('Error liberando equipos del empleado:', errEquipos);
                return callback(errEquipos);
            }

            // Log opcional para saber cuántos equipos se liberaron
            if (this.changes > 0) {
                console.log(`♻️ Se liberaron ${this.changes} equipos asignados al empleado ID ${id}`);
            }

            // PASO 2: Desactivar al empleado (El código original)
            const sqlEmpleado = `UPDATE empleados SET activo = 0 WHERE id = ?`;
            
            db.run(sqlEmpleado, [id], function(errEmpleado) {
                if (errEmpleado) {
                    console.error('Error en delete empleado:', errEmpleado);
                    callback(errEmpleado);
                } else {
                    // Retornamos el éxito de la operación
                    callback(null, this.changes);
                }
            });
        });
    }

    // Buscar empleados por departamento
    static getByDepartamento(departamento, callback) {
        const sql = `
            SELECT * FROM empleados 
            WHERE departamento = ? AND activo = 1 
            ORDER BY nombre, apellido
        `;
        db.all(sql, [departamento], (err, rows) => {
            if (err) {
                console.error('Error en getByDepartamento:', err);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }
}

module.exports = Empleado;