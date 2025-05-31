import { pool } from '../db.js';

export const getMascotasPendientesTratamiento = async (req, res) => {
    try {
        const { idUsuario } = req.params; 

        // Consulta para obtener mascotas adoptadas por el usuario, que no estén vacunadas o esterilizadas
        // Unir con la tabla 'adopciones' para filtrar por el 'id_usuario'
        // Asegúrate de que los valores 'no' en la base de datos sean exactamente 'no' (minúsculas, sin espacios extra)
        const [mascotas] = await pool.query(
            `SELECT 
                m.id_mascota, 
                m.nombre, 
                m.especie, 
                m.raza, 
                m.edad, 
                m.esta_vacunado, 
                m.esta_esterilizado,
                m.foto_mascota, 
                a.id_usuario
            FROM 
                mascotas m
            JOIN 
                adopciones a ON m.id_mascota = a.id_mascota
            WHERE 
                a.id_usuario = ? 
                AND (m.esta_vacunado = 'no' OR m.esta_esterilizado = 'no')`,
            [idUsuario]
        );

        mascotas.forEach(pet => {
            if (pet.foto_mascota) {
                pet.foto_mascota = pet.foto_mascota.toString('base64');
            }
        });
        // Si mascotas.length es 0, y en MySQL Workbench sí aparecen, el problema es la consulta SQL o los datos.
        // Si mascotas.length es > 0, pero no aparecen en frontend, el problema es la transferencia o el renderizado.
        res.json(mascotas);
    } catch (error) {
        console.error("Backend: Error al obtener mascotas pendientes de tratamiento:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Función para obtener la lista de veterinarios
export const getVeterinarios = async (req, res) => {
    try {
        const [veterinarios] = await pool.query("SELECT id_veterinario, nombre, apellidos, especialidad FROM veterinarios");
        res.json(veterinarios);
    } catch (error) {
        console.error("Error al obtener veterinarios:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Función para agendar una nueva cita de tratamiento
export const agendarCita = async (req, res) => {
    try {
        const { id_mascota, id_usuario, id_veterinario, tipo_tratamiento, fecha_cita, hora_cita, observaciones } = req.body;

        // Validación básica de campos
        if (!id_mascota || !id_usuario || !id_veterinario || !tipo_tratamiento || !fecha_cita || !hora_cita) {
            return res.status(400).json({ message: "Faltan campos obligatorios para agendar la cita." });
        }

        // Insertar la cita en la base de datos
        const [result] = await pool.query(
            `INSERT INTO citas_tratamientos 
            (id_mascota, id_usuario, id_veterinario, tipo_tratamiento, fecha_cita, hora_cita, observaciones) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_mascota, id_usuario, id_veterinario, tipo_tratamiento, fecha_cita, hora_cita, observaciones]
        );

        res.status(201).json({ message: "Cita agendada con éxito", citaId: result.insertId });
    } catch (error) {
        console.error("Error al agendar la cita:", error);
        return res.status(500).json({ message: error.message });
    }
};