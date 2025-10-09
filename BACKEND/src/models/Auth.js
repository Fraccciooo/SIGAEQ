const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Auth {
    // Buscar usuario por username
    static findByUsername(username, callback) {
        const sql = `
            SELECT us.*, e.nombre, e.apellido, e.departamento, e.cargo
            FROM usuarios_sistema us
            LEFT JOIN empleados e ON us.empleado_id = e.id
            WHERE us.username = ? AND us.activo = 1
        `;
        db.get(sql, [username], callback);
    }

    // Verificar contraseña
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Hashear contraseña
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Actualizar último login
    static updateLastLogin(userId, callback) {
        const sql = `UPDATE usuarios_sistema SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [userId], callback);
    }

    // Crear nuevo usuario
    static createUser(userData, callback) {
        const sql = `
            INSERT INTO usuarios_sistema 
            (empleado_id, username, password_hash, rol) 
            VALUES (?, ?, ?, ?)
        `;
        
        const params = [
            userData.empleado_id,
            userData.username,
            userData.password_hash,
            userData.rol || 'Empleado'
        ];

        db.run(sql, params, function(err) {
            callback(err, { id: this.lastID });
        });
    }
}

module.exports = Auth;