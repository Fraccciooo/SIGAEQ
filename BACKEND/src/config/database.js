const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ruta ABSOLUTA a la base de datos SQLite
const dbPath = path.resolve(__dirname, '../../../BASE_DE_DATOS/sigaeq.db');

// Verificar si el archivo de base de datos existe
if (!fs.existsSync(dbPath)) {
    console.log('⚠️  Archivo de base de datos no encontrado. Creando nuevo...');
    
    // Crear directorio si no existe
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error conectando a SQLite:', err.message);
        console.log('📁 Ruta intentada:', dbPath);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        console.log('📊 Ubicación:', dbPath);
    }
});

// Verificar que las tablas existan
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='empleados'", (err, row) => {
    if (err) {
        console.error('❌ Error verificando tablas:', err.message);
    } else if (!row) {
        console.log('⚠️  Las tablas no existen. Ejecuta el script de inicialización.');
    } else {
        console.log('✅ Tablas verificadas correctamente');
    }
});

// Manejar cierre de conexión
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('🔌 Conexión a la base de datos cerrada.');
        process.exit(0);
    });
});

module.exports = db;