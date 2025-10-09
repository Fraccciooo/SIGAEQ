const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Primero probamos con varios departamentos posibles
const departamentosPrueba = ['Tecnología', 'Tecnologia', 'Informática', 'TIC', 'Presidencia'];

const endpoints = [
    // Endpoints básicos
    { method: 'GET', path: '/' },
    
    // Empleados
    { method: 'GET', path: '/api/empleados' },
    { method: 'GET', path: '/api/empleados/1' },
    // El departamento lo probaremos después
    
    // Equipos
    { method: 'GET', path: '/api/equipos' },
    { method: 'GET', path: '/api/equipos/1' },
    { method: 'GET', path: '/api/equipos/estado/Disponible' },
    { method: 'GET', path: '/api/equipos/estado/Asignado' },
    
    // Asignaciones
    { method: 'GET', path: '/api/asignaciones' },
    { method: 'GET', path: '/api/asignaciones/estadisticas' },
    { method: 'GET', path: '/api/asignaciones/equipo/1' },
    { method: 'GET', path: '/api/asignaciones/empleado/1' }
];

function testEndpoint(method, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method
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
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        success: false,
                        path: path,
                        error: 'Invalid JSON response'
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject({
                path: path,
                error: err.message
            });
        });

        req.end();
    });
}

async function testDepartamentos() {
    console.log('\n🔍 PROBANDO DIFERENTES DEPARTAMENTOS:');
    
    for (const depto of departamentosPrueba) {
        const path = `/api/empleados/departamento/${encodeURIComponent(depto)}`;
        try {
            const result = await testEndpoint('GET', path);
            if (result.status === 200 && result.success) {
                console.log(`✅ GET ${path} - Status: ${result.status} (${result.data.total} empleados)`);
                return depto; // Devolver el departamento que funciona
            } else {
                console.log(`❌ GET ${path} - Status: ${result.status}`);
            }
        } catch (error) {
            console.log(`💥 GET ${path} - Error: ${error.error}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
}

async function runAllTests() {
    console.log('🚀 INICIANDO PRUEBAS DE ENDPOINTS\n');
    
    let passed = 0;
    let failed = 0;

    // Primero probar endpoints básicos
    for (const endpoint of endpoints) {
        try {
            const result = await testEndpoint(endpoint.method, endpoint.path);
            
            if (result.status >= 200 && result.status < 400) {
                console.log(`✅ ${endpoint.method} ${endpoint.path} - Status: ${result.status}`);
                passed++;
            } else {
                console.log(`❌ ${endpoint.method} ${endpoint.path} - Status: ${result.status}`);
                if (result.data && result.data.error) {
                    console.log(`   💡 Error: ${result.data.error}`);
                }
                failed++;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`💥 ${endpoint.method} ${endpoint.path} - Error: ${error.error}`);
            failed++;
        }
    }

    // Ahora probar departamentos
    const deptoFuncional = await testDepartamentos();
    if (deptoFuncional) {
        passed++; // Contar como éxito
        endpoints.push({ method: 'GET', path: `/api/empleados/departamento/${deptoFuncional}` });
    } else {
        failed++;
    }

    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log(`✅ Pasadas: ${passed}`);
    console.log(`❌ Falladas: ${failed}`);
    console.log(`📈 Total: ${endpoints.length}`);
    
    if (failed === 0) {
        console.log('\n🎉 ¡Todas las pruebas pasaron! El backend está funcionando correctamente.');
    } else {
        console.log('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
    }
}

console.log('🔍 Verificando que el servidor esté corriendo...');
runAllTests().catch(console.error);