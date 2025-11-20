const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Credenciales corregidas basadas en lo que encontremos
const testCredentials = [
    { username: 'aprimera', password: 'admin123', description: 'Admin Principal' },
    { username: 'ybompart', password: 'rh123', description: 'Recursos Humanos' },
    { username: 'walwin30', password: 'tecno1+', description: 'Tecnología' }
];

function makeRequest(method, path, data = null, token = null) {
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

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

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

async function testLogin() {
    console.log('🔐 PROBANDO CREDENCIALES DE LOGIN:\n');
    
    let authToken = null;
    let successfulLogin = null;

    for (const cred of testCredentials) {
        console.log(`   Probando: ${cred.username} / ${cred.password} (${cred.description})`);
        
        try {
            const result = await makeRequest('POST', '/api/auth/login', {
                username: cred.username,
                password: cred.password
            });

            if (result.success && result.data && result.data.data && result.data.data.token) {
                authToken = result.data.data.token;
                successfulLogin = cred;
                console.log(`   ✅ LOGIN EXITOSO!`);
                console.log(`   🔐 Token: ${authToken.substring(0, 30)}...`);
                console.log(`   👤 Usuario: ${result.data.data.user.nombre} ${result.data.data.user.apellido}`);
                console.log(`   🎯 Rol: ${result.data.data.user.rol}`);
                break;
            } else {
                console.log(`   ❌ Falló: ${result.data?.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.log(`   💥 Error: ${error.error}`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { authToken, successfulLogin };
}

async function testProtectedEndpoints(token) {
    console.log('\n🔒 PROBANDO ENDPOINTS PROTEGIDOS:\n');
    
    const protectedTests = [
        { method: 'GET', path: '/api/auth/me', description: 'Información del usuario actual' },
        { method: 'POST', path: '/api/empleados', data: {
            cedula: 'V-99988877',
            nombre: 'TEST',
            apellido: 'PROTEGIDO', 
            cargo: 'Tester',
            fecha_ingreso: '2024-01-01',
            departamento: 'Testing',
            correo: 'test_protegido@fundacionmusica.org'
        }, description: 'Crear empleado (solo admin)' }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of protectedTests) {
        console.log(`   ${test.method} ${test.path} - ${test.description}`);
        
        try {
            const result = await makeRequest(test.method, test.path, test.data, token);
            
            if (result.status >= 200 && result.status < 400) {
                console.log(`   ✅ Status: ${result.status} - ÉXITO`);
                passed++;
            } else {
                console.log(`   ❌ Status: ${result.status} - FALLÓ`);
                if (result.data && result.data.error) {
                    console.log(`      💡 Error: ${result.data.error}`);
                }
                failed++;
            }
        } catch (error) {
            console.log(`   💥 Error: ${error.error}`);
            failed++;
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    return { passed, failed };
}

async function runCompleteTest() {
    console.log('🚀 PRUEBA COMPLETA CON AUTENTICACIÓN\n');
    console.log('=' .repeat(50));

    // 1. Probar login
    const { authToken, successfulLogin } = await testLogin();

    if (!authToken) {
        console.log('\n❌ No se pudo hacer login con ninguna credencial.');
        console.log('💡 Ejecuta: node update_passwords.js para resetear contraseñas');
        return;
    }

    console.log(`\n🎯 LOGIN EXITOSO CON: ${successfulLogin.username}`);

    // 2. Probar endpoints protegidos
    const protectedResults = await testProtectedEndpoints(authToken);

    // 3. Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN FINAL:');
    console.log(`✅ Login exitoso: ${successfulLogin.username}`);
    console.log(`🔒 Endpoints protegidos: ${protectedResults.passed} pasados, ${protectedResults.failed} fallados`);
    
    if (protectedResults.failed === 0) {
        console.log('\n🎉 ¡SISTEMA DE AUTENTICACIÓN FUNCIONANDO CORRECTAMENTE!');
        console.log('🚀 Puedes continuar con el frontend React.');
    }
}

// Ejecutar prueba completa
runCompleteTest().catch(console.error);