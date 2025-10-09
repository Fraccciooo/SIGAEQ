-- =============================================
-- SIGAEQ - INSERTAR DATOS (CON MANEJO DE DUPLICADOS)
-- =============================================

-- Presidencia
INSERT OR IGNORE INTO empleados (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo, activo) 
VALUES 
('11992956', 'ALI ALEJANDRO', 'PRIMERA GONZALEZ', 'PRESIDENTE', '2021-03-25', 'Presidencia', 'aleprimera@fcnm.gob.ve', 1);

-- Recursos Humanos / Planificación
INSERT OR IGNORE INTO empleados (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo, activo) 
VALUES 
('4169974', 'ZULME JOSEFINA', 'APONTE DIAZ', 'HP - PRESUPUESTO', '2025-01-01', 'Recursos Humanos', 'zaponte@fcnm.gob.ve', 1),
('6208870', 'RAIZA JOSEFINA', 'BENCOMO', 'HP - PLANIFICACION', '2025-01-01', 'Planificación', 'rbencomo@fcnm.gob.ve', 1),
('10506544', 'HERMELINDA YASMINA', 'VEGAS MENDOZA', 'HP - PLANIFICACION', '2025-01-01', 'Planificación', 'hvegas@fcnm.gob.ve', 1),
('14611794', 'BOMPART MOYA', 'YSABEL MARIA', 'HP - PLANIFICACION', '2023-08-16', 'Recursos Humanos', 'ysabelbompart@gmail.com', 1);

-- Contabilidad / Finanzas
INSERT OR IGNORE INTO empleados (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo, activo) 
VALUES 
('6519693', 'JOSE ALBERTO', 'PINTO RAMIREZ', 'HP - CONTABILIDAD', '2025-01-01', 'Contabilidad', 'jpinto@fcnm.gob.ve', 1),
('4425240', 'NINFA ESTELA', 'CONTRAMAESTRE DE CAPOTE', 'HP - PRESIDENCIA', '2025-01-01', 'Finanzas', 'ncontramaestre@fcnm.gob.ve', 1);

-- Tecnología / Informática
INSERT OR IGNORE INTO empleados (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo, activo) 
VALUES 
('10350578', 'OSCAR MANUEL', 'GONZALEZ', 'HP - INFORMATICA', '2025-01-01', 'Tecnología', 'ogonzalez@fcnm.gob.ve', 1),
('12485213', 'GIOVANNI FRANCESCO', 'MAIURI DEL BUONO', 'INFORMATICA', '2025-01-01', 'Tecnología', 'gmaiuri@fcnm.gob.ve', 1),
('14453395', 'REINALDO JOSE', 'GRUBER SANCHEZ', 'INFORMATICA', '2025-01-01', 'Tecnología', 'rgruber@fcnm.gob.ve', 1),
('15573566', 'JEAN GABRIEL', 'ECHEGARRAY SOJO', 'TECNOLOGIA', '2025-01-01', 'Tecnología', 'jechegarray@fcnm.gob.ve', 1),
('29935858', 'WALTER ENRIQUE', 'VINCENTI PORTILLO', 'INFORMATICA', '2025-01-01', 'Tecnología', 'waltervincenti30@gmail.com', 1);

-- Mantenimiento
INSERT OR IGNORE INTO empleados (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo, activo) 
VALUES 
('10828999', 'CAROL YUSETH', 'PINOCASTRO', 'HP - MANTENIMIENTO', '2025-01-01', 'Mantenimiento', 'cpino@fcnm.gob.ve', 1),
('11673487', 'LUISA ANGELICA', 'FERMENAL FIGUERA', 'HP - MANTENIMIENTO', '2025-01-01', 'Mantenimiento', 'lfermenal@fcnm.gob.ve', 1),
('15700572', 'TANIA MAGALY', 'TROYA ARANGUREN', 'HP - MANTENIMIENTO', '2025-01-01', 'Mantenimiento', 'ttroya@fcnm.gob.ve', 1);

-- Estrategias / Proyectos
INSERT OR IGNORE INTO empleados (cedula, nombre, apellido, cargo, fecha_ingreso, departamento, correo, activo) 
VALUES 
('16331604', 'MARIA ALEJANDRA', 'JIMENEZ MARIN', 'HP - ESTRATEGIAS', '2025-01-01', 'Estrategias', 'mjimenez@fcnm.gob.ve', 1),
('30019436', 'JEREMIAS', 'FIGUEREDO', 'HP - ESTRATEGIAS', '2025-01-01', 'Estrategias', 'jfigueredo@fcnm.gob.ve', 1);

-- Insertar equipos de prueba
INSERT OR IGNORE INTO equipos (tipo, marca, modelo, numero_serial, estado, ubicacion, empleado_id) VALUES
('Laptop', 'Dell', 'XPS 13', 'DLXPS132023001', 'Asignado', 'Oficina Presidencia', 1),
('Laptop', 'HP', 'EliteBook 840', 'HPELB8402023001', 'Asignado', 'Oficina RH', 2),
('Tablet', 'iPad', 'Pro 12.9"', 'APPIPAD2023001', 'Disponible', 'Almacén Central', NULL),
('Monitor', 'LG', '27UL500', 'LG27UL2023001', 'Asignado', 'Oficina Tecnología', 7),
('Impresora', 'HP', 'LaserJet Pro', 'HPLJP2023001', 'Mantenimiento', 'Taller Técnico', NULL),
('Laptop', 'Lenovo', 'ThinkPad X1', 'LENTP2023001', 'Disponible', 'Almacén Central', NULL);

-- Insertar historial de asignaciones
INSERT OR IGNORE INTO historial_asignaciones (equipo_id, empleado_id_anterior, empleado_id_nuevo, administrador_id, observaciones) VALUES
(1, NULL, 1, 1, 'Asignación inicial al Presidente'),
(2, NULL, 2, 1, 'Asignación a Recursos Humanos'),
(4, NULL, 7, 1, 'Asignación a Tecnología');

-- Insertar usuarios del sistema
INSERT OR IGNORE INTO usuarios_sistema (empleado_id, username, password_hash, rol) VALUES
(1, 'aprimera', 'admin123', 'Presidencia'),
(5, 'ybompart', 'rh123', 'Jefe Recursos Humanos'),
(12, 'walvin30', 'tech123', 'Jefe Tecnologia');


SELECT '✅ Datos insertados exitosamente' AS mensaje;
SELECT '📊 Empleados insertados: ' || COUNT(*) FROM empleados;
SELECT '📱 Equipos insertados: ' || COUNT(*) FROM equipos;