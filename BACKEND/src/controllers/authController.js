const Auth = require('../models/Auth');
const { generateToken } = require('../config/jwt.config');

// Login de usuario
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username y password son requeridos'
        });
    }

    try {
        // Buscar usuario
        Auth.findByUsername(username, async (err, user) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Error en el servidor'
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await Auth.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // Actualizar último login
            Auth.updateLastLogin(user.id, (updateErr) => {
                if (updateErr) {
                    console.error('Error actualizando último login:', updateErr);
                }
            });

            // Generar token
            const tokenPayload = {
                id: user.id,
                username: user.username,
                rol: user.rol,
                empleado_id: user.empleado_id,
                nombre: user.nombre,
                apellido: user.apellido
            };

            const token = generateToken(tokenPayload);

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    token,
                    user: tokenPayload
                }
            });
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

// Verificar token (me)
const getMe = (req, res) => {
    res.json({
        success: true,
        data: {
            user: req.user
        }
    });
};

// Registrar nuevo usuario (solo admin)
const register = async (req, res) => {
    const { empleado_id, username, password, rol } = req.body;

    if (!empleado_id || !username || !password) {
        return res.status(400).json({
            success: false,
            error: 'empleado_id, username y password son requeridos'
        });
    }

    try {
        // Hashear contraseña
        const hashedPassword = await Auth.hashPassword(password);

        const userData = {
            empleado_id,
            username,
            password_hash: hashedPassword,
            rol: rol || 'Empleado'
        };

        Auth.createUser(userData, (err, result) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        success: false,
                        error: 'El username ya existe'
                    });
                }
                return res.status(500).json({
                    success: false,
                    error: 'Error creando usuario'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: {
                    id: result.id,
                    username: userData.username,
                    rol: userData.rol
                }
            });
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    login,
    getMe,
    register
};