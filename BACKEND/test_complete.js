const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Datos de prueba para crear empleados y equipos
const testEmpleado = {
    cedula: 'V-99999999',
    nombre: 'TEST',
    apellido: 'USUARIO',
    cargo: 'Tester',
    fecha_ingreso: '2024-01-01',
    departamento: 'Calidad',
    correo: 'test@fundacionmusica.org'
};

const testEquipo = {
    tipo: 'Monitor',
    marca: 'Samsung',
    modelo: 'S24F350',
    numero_serial: 'TEST-SERIAL-001',
    estado: 'Disponible',
    ubicacion: 'Oficina Testing'
};

// Función para hacer requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        success: jsonData.success !== false,
                        path: path,
                        method: method,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        success: false,
                        path: path,
                        method: method,
                        error: 'Invalid JSON response',
                        raw: data
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject({
                path: path,
                method: method,
                error: err.message
            });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Tests organizados por categoría
const tests = [
    // === ENDPOINTS PÚBLICOS ===
    {
        category: '🔗 Endpoints Públicos',
        tests: [
            { method: 'GET', path: '/', description: 'Página principal' },
            { method: 'POST', path: '/api/auth/login', data: { username: 'aprimera', password: 'admin123' }, description: 'Login' }
        ]
    },

    // === EMPLEADOS (GET) ===
    {
        category: '👥 Empleados (Lectura)',
        tests: [
            { method: 'GET', path: '/api/empleados', description: 'Todos los empleados' },
            { method: 'GET', path: '/api/empleados/1', description: 'Empleado por ID' },
            { method: 'GET', path: '/api/empleados/departamento/Presidencia', description: 'Empleados por departamento' }
        ]
    },

    // === EQUIPOS (GET) ===
    {
        category: '💻 Equipos (Lectura)',
        tests: [
            { method: 'GET', path: '/api/equipos', description: 'Todos los equipos' },
            { method: 'GET', path: '/api/equipos/1', description: 'Equipo por ID' },
            { method: 'GET', path: '/api/equipos/estado/Disponible', description: 'Equipos disponibles' },
            { method: 'GET', path: '/api/equipos/estado/Asignado', description: 'Equipos asignados' }
        ]
    },

    // === ASIGNACIONES (GET) ===
    {
        category: '📋 Asignaciones (Lectura)',
        tests: [
            { method: 'GET', path: '/api/asignaciones', description: 'Todo el historial' },
            { method: 'GET', path: '/api/asignaciones/estadisticas', description: 'Estadísticas' },
            { method: 'GET', path: '/api/asignaciones/equipo/1', description: 'Historial por equipo' },
            { method: 'GET', path: '/api/asignaciones/empleado/1', description: 'Historial por empleado' }
        ]
    }
];

async function runTests() {
    console.log('🚀 INICIANDO PRUEBAS COMPLETAS DEL BACKEND\n');
    console.log('📡 URL Base:', BASE_URL);
    console.log('=' .repeat(60));

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let authToken = null;

    for (const category of tests) {
        console.log(`\n${category.category}`);
        console.log('-'.repeat(50));

        for (const test of category.tests) {
            totalTests++;
            
            try {
                // Si es login, guardar el token
                if (test.path === '/api/auth/login' && test.data) {
                    const result = await makeRequest(test.method, test.path, test.data);
                    
                    if (result.success && result.data && result.data.data && result.data.data.token) {
                        authToken = result.data.data.token;
                        console.log(`✅ ${test.method} ${test.path} - ${test.description}`);
                        console.log(`   🔐 Token obtenido: ${authToken.substring(0, 20)}...`);
                        passedTests++;
                    } else {
                        console.log(`❌ ${test.method} ${test.path} - ${test.description}`);
                        console.log(`   💡 Error: ${result.data?.error || 'Falló el login'}`);
                        failedTests++;
                    }
                } else {
                    const result = await makeRequest(test.method, test.path, test.data);
                    
                    if (result.status >= 200 && result.status < 400) {
                        console.log(`✅ ${test.method} ${test.path} - ${test.description}`);
                        
                        // Mostrar información adicional útil
                        if (result.data && result.data.total !== undefined) {
                            console.log(`   📊 Total: ${result.data.total} registros`);
                        }
                        if (result.data && result.data.data && Array.isArray(result.data.data)) {
                            console.log(`   📋 Registros: ${result.data.data.length}`);
                        }
                        
                        passedTests++;
                    } else {
                        console.log(`❌ ${test.method} ${test.path} - ${test.description}`);
                        console.log(`   📊 Status: ${result.status}`);
                        if (result.data && result.data.error) {
                            console.log(`   💡 Error: ${result.data.error}`);
                        }
                        failedTests++;
                    }
                }
            } catch (error) {
                console.log(`💥 ${test.method} ${test.path} - ${test.description}`);
                console.log(`   🚨 Error: ${error.error}`);
                failedTests++;
            }

            // Pequeña pausa entre requests
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    // RESUMEN FINAL
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL DE PRUEBAS:');
    console.log(`✅ Pasadas: ${passedTests}`);
    console.log(`❌ Falladas: ${failedTests}`);
    console.log(`📈 Total: ${totalTests}`);
    console.log(`🎯 Porcentaje: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests === 0) {
        console.log('\n🎉 ¡EXCELENTE! Todos los endpoints funcionan correctamente.');
        console.log('🚀 Puedes continuar con la siguiente fase del proyecto.');
    } else if (passedTests / totalTests >= 0.8) {
        console.log('\n⚠️  La mayoría de los endpoints funcionan. Revisa los que fallaron.');
    } else {
        console.log('\n🔴 Hay varios endpoints que necesitan atención.');
    }

    if (authToken) {
        console.log(`\n🔐 Token de autenticación obtenido: ${authToken.substring(0, 30)}...`);
    }
}

// Verificar que el servidor esté corriendo antes de empezar
console.log('🔍 Verificando conexión con el servidor...');
makeRequest('GET', '/')
    .then(() => {
        runTests().catch(console.error);
    })
    .catch((error) => {
        console.log('❌ No se puede conectar al servidor. Asegúrate de que esté corriendo:');
        console.log('   💡 Ejecuta: npm run dev');
        console.log('   📍 Error:', error.error);
    });