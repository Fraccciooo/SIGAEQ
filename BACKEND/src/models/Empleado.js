const db = require('../config/database');

class Empleado {
    // Obtener todos los empleados
    static getAll(callback) {
        const sql = `
            SELECT * FROM empleados 
            WHERE activo = 1 
            ORDER BY nombre, apellido
        `;
        db.all(sql, [], callback);
    }

    // Obtener empleado por ID
    static getById(id, callback) {
        const sql = `SELECT * FROM empleados WHERE id = ? AND activo = 1`;
        db.get(sql, [id], callback);
    }

    // Obtener empleado por cédula
    static getByCedula(cedula, callback) {
        const sql = `SELECT * FROM empleados WHERE cedula = ? AND activo = 1`;
        db.get(sql, [cedula], callback);
    }

    // Crear nuevo empleado
    static create(empleadoData, callback) {
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
            empleadoData.departamento,
            empleadoData.correo
        ];

        db.run(sql, params, function(err) {
            callback(err, { id: this.lastID });
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
            empleadoData.departamento,
            empleadoData.correo,
            id
        ];

        db.run(sql, params, callback);
    }

    // Eliminar empleado (borrado lógico)
    static delete(id, callback) {
        const sql = `UPDATE empleados SET activo = 0 WHERE id = ?`;
        db.run(sql, [id], callback);
    }

    // Buscar empleados por departamento
    static getByDepartamento(departamento, callback) {
        const sql = `
            SELECT * FROM empleados 
            WHERE departamento = ? AND activo = 1 
            ORDER BY nombre, apellido
        `;
        db.all(sql, [departamento], callback);
    }
}

module.exports = Empleado;