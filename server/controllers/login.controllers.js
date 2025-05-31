import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Importar bcryptjs para el hashing seguro de contraseñas
import { JWT_SECRET } from '../config.js'; // Importa JWT_SECRET desde tu archivo de configuración

// Eliminar la función 'hash' personalizada y la importación de 'crypto' y 'dotenv'
// ya que usaremos bcryptjs para un manejo de contraseñas más seguro.

export const login = async (req, res) => { // Mantener el nombre de la función 'login'
    const { email, password } = req.body;

    console.log("Datos recibidos para login: ", req.body);

    // Verificación de que todos los campos están presentes y no son nulos o vacíos
    if (!email || !password) {
        console.log("Faltan campos obligatorios: email o password.");
        return res.status(400).send('Faltan campos obligatorios');
    }

    try {
        // Consulta para verificar el correo y obtener el hash de la contraseña y el rol
        // Asegúrate de seleccionar 'id_usuario' y 'role'
        const [rows] = await pool.query("SELECT id_usuario, nombre, apellidos, correo, contraseña, role FROM usuario WHERE correo = ?", [email]);

        if (rows.length === 0) {
            console.log("Correo no encontrado.");
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        const user = rows[0];
        
        // Comparar la contraseña proporcionada (texto plano) con el hash almacenado en la DB
        // Usamos bcrypt.compare para una verificación segura
        const isMatch = await bcrypt.compare(password, user.contraseña);

        if (!isMatch) {
            console.log("Contraseña incorrecta para el usuario:", email);
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        // Si las credenciales son válidas, generar un token JWT
        // El payload del token debe contener la información necesaria para 'verifyToken' y 'isAdmin'
        const token = jwt.sign(
            { id_usuario: user.id_usuario, role: user.role }, // Payload: id_usuario y role
            JWT_SECRET, // Usar la clave secreta importada de config.js
            { expiresIn: '1h' } // El token expirará en 1 hora
        );

        console.log("Login exitoso para usuario:", user.correo, "con rol:", user.role);
        
        // Enviar el token y la información básica del usuario (sin la contraseña hasheada)
        return res.json({ 
            message: "Login exitoso", 
            token, // Enviar el token al frontend
            user: { // Enviar información del usuario al frontend
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellidos: user.apellidos,
                correo: user.correo,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error en el proceso de login:", error);
        return res.status(500).json({ message: "Error interno del servidor al intentar iniciar sesión." });
    }
};

// Mantener la función getUserById si se usa en otras partes de tu aplicación.
// Nota: La consulta original usaba 'id' en lugar de 'id_usuario'. Asegúrate de que coincida con tu esquema.
export const getUserById = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [userId]); // Asumo 'id_usuario' es el nombre correcto
        return rows[0];
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        throw error; // Propagar el error para que sea manejado por el llamador
    }
};