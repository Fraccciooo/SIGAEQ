const db = require('./src/config/database');

console.log('🔍 VERIFICANDO DEPARTAMENTOS EXISTENTES...');

const sql = `SELECT DISTINCT departamento FROM empleados WHERE activo = 1 ORDER BY departamento`;

db.all(sql, [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    
    console.log('\n📊 DEPARTAMENTOS ENCONTRADOS:');
    rows.forEach((row, index) => {
        console.log(`${index + 1}. "${row.departamento}"`);
    });
    
    console.log('\n💡 SUGERENCIAS:');
    console.log('   Usa uno de estos departamentos en las pruebas');
    
    db.close();
});