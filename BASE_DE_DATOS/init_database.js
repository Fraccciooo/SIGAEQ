const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'sigaeq.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Inicializando base de datos SIGAEQ...');

// Función para ejecutar scripts SQL
function ejecutarScript(scriptFile) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'scripts', scriptFile);
        
        if (!fs.existsSync(scriptPath)) {
            reject(new Error(`Archivo no encontrado: ${scriptPath}`));
            return;
        }

        const sql = fs.readFileSync(scriptPath, 'utf8');
        db.exec(sql, (err) => {
            if (err) {
                console.log(`⚠️  Advertencia en ${scriptFile}: ${err.message}`);
                // Continuar aunque haya errores (duplicados, etc.)
                resolve(); 
            } else {
                console.log(`✅ ${scriptFile} ejecutado correctamente`);
                resolve();
            }
        });
    });
}

// Ejecutar todos los scripts en orden
async function inicializarBD() {
    try {
        const scriptsDir = path.join(__dirname, 'scripts');
        if (!fs.existsSync(scriptsDir)) {
            fs.mkdirSync(scriptsDir);
            console.log('📁 Carpeta scripts creada');
        }

        await ejecutarScript('1_create_tables.sql');
        await ejecutarScript('2_create_indexes.sql');
        await ejecutarScript('3_create_views.sql');
        await ejecutarScript('4_insert_data.sql');
        
        console.log('\n🎉 Base de datos inicializada exitosamente!');
        
        // Mostrar resumen final
        console.log('\n📊 RESUMEN FINAL:');
        
        db.get("SELECT COUNT(*) as total FROM empleados", (err, row) => {
            if (!err) console.log(`👥 Empleados: ${row.total}`);
        });
        
        db.get("SELECT COUNT(*) as total FROM equipos", (err, row) => {
            if (!err) console.log(`💻 Equipos: ${row.total}`);
        });
        
        db.get("SELECT COUNT(*) as total FROM usuarios_sistema", (err, row) => {
            if (!err) console.log(`🔐 Usuarios: ${row.total}`);
            
            // Mostrar algunos empleados como ejemplo
            console.log('\n👤 EJEMPLO DE EMPLEADOS:');
            db.all("SELECT id, nombre, apellido, departamento FROM empleados LIMIT 5", (err, rows) => {
                if (!err && rows) {
                    rows.forEach(emp => {
                        console.log(`   ${emp.id}. ${emp.nombre} ${emp.apellido} - ${emp.departamento}`);
                    });
                }
                db.close();
            });
        });
        
    } catch (error) {
        console.error('💥 Error durante la inicialización:', error.message);
        db.close();
    }
}

inicializarBD();