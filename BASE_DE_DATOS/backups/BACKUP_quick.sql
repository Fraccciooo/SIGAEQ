-- Script respaldo rápido

SELECT 'Base de datos SIGAEQ - Backup ' || CURRENT_DATE AS info;

SELECT '=== EMPLEADOS ===' AS seccion;
SELECT * FROM empleados;

SELECT '=== EQUIPOS ===' AS seccion;  
SELECT * FROM equipos;

SELECT '=== HISTORIAL ===' AS seccion;
SELECT * FROM historial_asignaciones;