const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

// Los 3 usuarios exactos que solicitaste
const usuariosDeseados = [
    {
        correoBusqueda: 'aleprimera@fcnm.gob.ve', // Para encontrar el ID de empleado
        username: 'aprimera',
        password: 'admin123',
        rol: 'Administrador'
    },
    {
        correoBusqueda: 'ysabelbompart@gmail.com',
        username: 'ybompart',
        password: 'rh123',
        rol: 'Jefe Departamento' // Asumo rol de RRHH
    },
    {
        correoBusqueda: 'waltervincenti30@gmail.com',
        username: 'walvin30',
        password: 'tecno1+',
        rol: 'Administrador' // Asumo rol técnico
    }
];

async function configurarUsuarios() {
    console.log('🚀 INICIANDO CONFIGURACIÓN DE ACCESO...\n');

    // 1. Primero, desactivamos TODOS los usuarios para cumplir con "dejar como único usuario..."
    // No los borramos para no romper historiales, solo quitamos acceso.
    await new Promise((resolve) => {
        db.run("UPDATE usuarios_sistema SET activo = 0", (err) => {
            if (!err) console.log('🔒 Se han desactivado temporalmente todos los accesos.');
            resolve();
        });
    });

    // 2. Procesar cada usuario
    for (const usuario of usuariosDeseados) {
        try {
            // A. Buscar el ID del empleado
            const empleado = await new Promise((resolve, reject) => {
                db.get("SELECT id, nombre, apellido FROM empleados WHERE correo LIKE ?", [`%${usuario.correoBusqueda}%`], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });

            if (!empleado) {
                console.error(`❌ No se encontró empleado con correo similar a: ${usuario.correoBusqueda}`);
                continue;
            }

            // B. Hashear la contraseña
            const hash = await bcrypt.hash(usuario.password, 10);

            // C. Verificar si ya existe usuario para este empleado
            const usuarioExistente = await new Promise((resolve) => {
                db.get("SELECT id FROM usuarios_sistema WHERE empleado_id = ?", [empleado.id], (err, row) => resolve(row));
            });

            if (usuarioExistente) {
                // ACTUALIZAR (Update)
                await new Promise((resolve, reject) => {
                    db.run(
                        `UPDATE usuarios_sistema 
                         SET username = ?, password_hash = ?, rol = ?, activo = 1 
                         WHERE empleado_id = ?`,
                        [usuario.username, hash, usuario.rol, empleado.id],
                        (err) => {
                            if (err) reject(err);
                            console.log(`✅ ACTUALIZADO: ${usuario.username} -> ${empleado.nombre} ${empleado.apellido}`);
                            resolve();
                        }
                    );
                });
            } else {
                // CREAR (Insert)
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO usuarios_sistema (empleado_id, username, password_hash, rol, activo) 
                         VALUES (?, ?, ?, ?, 1)`,
                        [empleado.id, usuario.username, hash, usuario.rol],
                        (err) => {
                            if (err) reject(err);
                            console.log(`✅ CREADO: ${usuario.username} -> ${empleado.nombre} ${empleado.apellido}`);
                            resolve();
                        }
                    );
                });
            }

        } catch (error) {
            console.error(`Error procesando ${usuario.username}:`, error);
        }
    }

    console.log('\n✨ PROCESO TERMINADO. Solo los 3 usuarios indicados tienen acceso activo.');
    db.close();
}

configurarUsuarios();