const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function updatePassword(username, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const sql = `UPDATE usuarios_sistema SET password_hash = ? WHERE username = ?`;
        
        db.run(sql, [hashedPassword, username], function(err) {
            if (err) {
                console.error(`❌ Error actualizando ${username}:`, err.message);
            } else {
                console.log(`✅ Contraseña actualizada para ${username}: "${newPassword}"`);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Actualizar contraseñas a valores conocidos
console.log('🔄 ACTUALIZANDO CONTRASEÑAS...');

const users = [
    { username: 'aprimera', password: 'admin123' },
    { username: 'ybompai', password: 'rh123' },
    { username: 'walwin', password: 'tech123' }
];

users.forEach(user => {
    updatePassword(user.username, user.password);
});

// Pequeña pausa para que se completen las operaciones
setTimeout(() => {
    console.log('\n🎯 CONTRASEÑAS ACTUALIZADAS:');
    console.log('   👤 aprimera / admin123');
    console.log('   👤 ybompai / rh123'); 
    console.log('   👤 walwin / tech123');
    console.log('\n💡 Ahora puedes usar estas credenciales para login');
    db.close();
}, 1000);