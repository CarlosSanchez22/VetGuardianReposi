import bcrypt from 'bcryptjs'; // Asegúrate de tener bcryptjs instalado (npm install bcryptjs)

const generateHash = async () => {
    const password = 'ISDF14042821'; // <--- ¡CAMBIA ESTO! Elige una contraseña segura
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del salt (número de rondas de hashing)
    console.log('Hash generado para la contraseña:', hashedPassword);
};

generateHash();