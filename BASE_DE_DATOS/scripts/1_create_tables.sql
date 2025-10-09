-- =============================================
-- SIGAEQ - CREACIÓN DE TABLAS
-- =============================================

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    cargo TEXT NOT NULL,
    fecha_ingreso TEXT NOT NULL,
    departamento TEXT,
    correo TEXT UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT 1,
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    marca TEXT,
    modelo TEXT,
    numero_serial TEXT UNIQUE NOT NULL,
    estado TEXT CHECK (estado IN ('Disponible', 'Asignado', 'Mantenimiento', 'Baja')),
    ubicacion TEXT,
    empleado_id INTEGER,
    fecha_registro TEXT DEFAULT CURRENT_DATE,
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE SET NULL
);

-- Tabla de historial de asignaciones
CREATE TABLE IF NOT EXISTS historial_asignaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipo_id INTEGER NOT NULL,
    empleado_id_anterior INTEGER,
    empleado_id_nuevo INTEGER,
    fecha_cambio TEXT DEFAULT CURRENT_DATE,
    administrador_id INTEGER,
    observaciones TEXT,
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id_anterior) REFERENCES empleados(id) ON DELETE SET NULL,
    FOREIGN KEY (empleado_id_nuevo) REFERENCES empleados(id) ON DELETE SET NULL,
    FOREIGN KEY (administrador_id) REFERENCES empleados(id) ON DELETE SET NULL
);

-- Tabla de usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER UNIQUE,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol TEXT CHECK (rol IN ('Administrador', 'Jefe Departamento', 'Empleado')),
    activo BOOLEAN DEFAULT 1,
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TEXT,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
);

SELECT '✅ Tablas creadas exitosamente' AS mensaje;