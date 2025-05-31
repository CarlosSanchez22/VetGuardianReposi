import { pool } from '../db.js';
import bcrypt from 'bcryptjs'; // Importar bcryptjs para el hashing seguro de contraseñas


export const createUser = async (req, res) => {
    try {
        const { name, lastname, email, password, phoneNumber, birthdate, hasPets } = req.body;

        // console.log(hash(password)) // Eliminar esta línea ya que 'hash' ya no existe
        console.log("Datos recibidos para registro: ", req.body);

        // Verificación de que todos los campos están presentes y no son nulos o vacíos
        if (!name || !lastname || !email || !password || !phoneNumber || !birthdate || hasPets === undefined) { // Añadí verificación para hasPets
            console.log("Faltan campos obligatorios para el registro.");
            return res.status(400).send('Faltan campos obligatorios');
        }

        try {
            // *** ¡CLAVE! Hashear la contraseña con bcrypt antes de guardarla ***
            const hashedPassword = await bcrypt.hash(password, 10); // 10 rondas de salt

            const [result] = await pool.query(
                'INSERT INTO usuario (nombre, apellidos, correo, contraseña, telefono, cumpleaños, tiene_mascotas, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, lastname, email, hashedPassword, phoneNumber, birthdate, hasPets, 'user'] // Usar el hash de bcrypt
            );

            console.log("Usuario Registrado con éxito. ID:", result.insertId);
            res.status(201).json({ message: 'Usuario Registrado con éxito', userId: result.insertId }); // Enviar una respuesta JSON más descriptiva
        } catch (error) {
            console.error("Error al registrarse:", error);
            // Si el correo ya existe, MySQL dará un error de clave única
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
            }
            res.status(500).send('Error interno del servidor al registrarse');
        }
    } catch (error) {
        console.error("Error general en createUser:", error);
        return res.status(500).json({ message: error.message });
    }
};
