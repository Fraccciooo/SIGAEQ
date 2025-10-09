CREATE INDEX IF NOT EXISTS idx_empleados_cedula ON empleados(cedula);
CREATE INDEX IF NOT EXISTS idx_empleados_departamento ON empleados(departamento);
CREATE INDEX IF NOT EXISTS idx_empleados_activo ON empleados(activo);

CREATE INDEX IF NOT EXISTS idx_equipos_estado ON equipos(estado);
CREATE INDEX IF NOT EXISTS idx_equipos_tipo ON equipos(tipo);
CREATE INDEX IF NOT EXISTS idx_equipos_empleado_id ON equipos(empleado_id);
CREATE INDEX IF NOT EXISTS idx_equipos_serial ON equipos(numero_serial);

CREATE INDEX IF NOT EXISTS idx_historial_equipo_id ON historial_asignaciones(equipo_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha_cambio ON historial_asignaciones(fecha_cambio);

CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios_sistema(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios_sistema(rol);

SELECT '✅ Índices creados exitosamente' AS mensaje;