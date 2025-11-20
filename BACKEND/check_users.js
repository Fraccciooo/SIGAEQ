const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

console.log('🔍 VERIFICANDO USUARIOS DEL SISTEMA...');

const sql = `
    SELECT 
        us.id, 
        us.username, 
        us.password_hash,
        us.rol,
        e.nombre, 
        e.apellido,
        e.departamento
    FROM usuarios_sistema us
    LEFT JOIN empleados e ON us.empleado_id = e.id
    WHERE us.activo = 1
`;

db.all(sql, [], async (err, rows) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    
    console.log('\n📊 USUARIOS ENCONTRADOS:');
    
    for (const user of rows) {
        console.log(`\n👤 Usuario: ${user.username}`);
        console.log(`   📝 Nombre: ${user.nombre} ${user.apellido}`);
        console.log(`   🏢 Departamento: ${user.departamento}`);
        console.log(`   🔑 Rol: ${user.rol}`);
        console.log(`   🔐 Password Hash: ${user.password_hash}`);
        
        // Probar contraseñas comunes
        const commonPasswords = ['admin123', 'rh123', 'tecno1+', 'password', '123456'];
        let found = false;
        
        for (const password of commonPasswords) {
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (isValid) {
                console.log(`   ✅ Contraseña encontrada: "${password}"`);
                found = true;
                break;
            }
        }
        
        if (!found) {
            console.log(`   ❌ Contraseña no identificada`);
        }
    }
    
    console.log('\n💡 INSTRUCCIONES:');
    console.log('   Usa uno de los usuarios y contraseñas encontrados arriba');
    
    db.close();
});