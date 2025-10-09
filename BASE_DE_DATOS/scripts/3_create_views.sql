-- =============================================
-- SIGAEQ - CREACIÓN DE VISTAS
-- =============================================

-- Vista: Equipos asignados con información de empleados
CREATE VIEW IF NOT EXISTS vista_equipos_asignados AS
SELECT 
    e.id AS equipo_id,
    e.tipo,
    e.marca,
    e.modelo,
    e.numero_serial,
    emp.id AS empleado_id,
    emp.nombre || ' ' || emp.apellido AS empleado_nombre,
    emp.departamento,
    emp.cargo,
    e.fecha_registro
FROM equipos e
INNER JOIN empleados emp ON e.empleado_id = emp.id
WHERE e.estado = 'Asignado' AND emp.activo = 1;

-- Vista: Equipos disponibles por tipo
CREATE VIEW IF NOT EXISTS vista_equipos_disponibles AS
SELECT 
    tipo,
    marca,
    modelo,
    COUNT(*) as cantidad,
    GROUP_CONCAT(numero_serial) AS seriales
FROM equipos 
WHERE estado = 'Disponible'
GROUP BY tipo, marca, modelo;

-- Vista: Resumen por departamento
CREATE VIEW IF NOT EXISTS vista_resumen_departamentos AS
SELECT 
    e.departamento,
    COUNT(DISTINCT e.id) AS total_empleados,
    COUNT(DISTINCT eq.id) AS equipos_asignados
FROM empleados e
LEFT JOIN equipos eq ON e.id = eq.empleado_id AND eq.estado = 'Asignado'
WHERE e.activo = 1
GROUP BY e.departamento;

SELECT '✅ Vistas creadas exitosamente' AS mensaje;