import { Router } from "express";
import { pool } from '../db.js';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post("/darAdopcion", upload.single('foto_mascota'), async (req, res) => {
    try {
        const {
            nombre,
            edad,
            especie,
            raza,
            esta_esterilizado,
            esta_vacunado,
            descripcion,
        } = req.body;

        const foto_mascota_buffer = req.file ? req.file.buffer : null; // Este es el búfer de la imagen
        console.log("Datos recibidos (texto): ", req.body);
        console.log("Archivo recibido por Multer:", req.file ? "Sí, tamaño:" + req.file.buffer.length : "No");

        if (!foto_mascota_buffer) {
            return res.status(400).send("Error: La foto de la mascota es obligatoria.");
        }

        try {
            // Inserta solo en 'foto_mascota', elimina 'imagen' de la lista de columnas y parámetros
            await pool.query(
                "INSERT INTO mascotas (nombre, edad, especie, raza, esta_esterilizado, esta_vacunado, descripcion, foto_mascota) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    nombre,
                    edad,
                    especie,
                    raza,
                    esta_esterilizado,
                    esta_vacunado,
                    descripcion,
                    foto_mascota_buffer,
                ]
            );
            res.send("Mascota Registrada con éxito");
        } catch (error) {
            console.error("Error al registrar mascota en la base de datos:", error);
            res.status(500).send("Error al registrarse");
        }
    } catch (error) {
        console.error("Error general en darAdopcion (ruta):", error);
        return res.status(500).json({ message: error.message });
    }
});

router.post('/api/registro_usuario', upload.single('fotoPerfil'), async (req, res) => {
    const { nombre, apellido, email, contrasena, telefono, fechaNacimiento, genero } = req.body;
    const fotoPerfil = req.file ? req.file.buffer : null;
    try {
        const result = await pool.query(
            "INSERT INTO ramses (nombre, apellido, email, contraseña, nivel_access, telefono, fecha_nacimiento, genero, foto_perfil) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)",
            [
                nombre,
                apellido,
                email,
                contrasena,
                telefono,
                fechaNacimiento,
                genero,
                fotoPerfil
            ]
        );
        res.send("ramses Registrada con éxito");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrarse");
    }
});

router.get('/api/obtener_usuario/:id', async (req, res) => {
    const userId = req.params.id;
    const [rows] = await pool.query('SELECT foto_perfil FROM ramses WHERE id = ?', [userId]);
    const user = rows[0];
    if (user.foto_perfil) {
        // Convertir la imagen a base64 si existe
        user.foto_perfil = user.foto_perfil.toString('base64');
    }
    res.status(200).send({ success: true, data: user });
});

router.post("/adoptar ", (req, res) => {
    res.status(501).send("La ruta /adoptar aún no está completamente implementada.");
});

export default router;