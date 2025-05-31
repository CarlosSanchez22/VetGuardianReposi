import { pool } from '../db.js';

export const getUserStuff = async (req, res) => {
    try {
        let { id } = req.params;

        // Convertir el ID a entero para asegurar que sea un número válido
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID de usuario inválido." });
        }

        // Usar parámetros de consulta (?) para seguridad y evitar errores de sintaxis
        const [adoptions] = await pool.query(`SELECT * FROM adopciones WHERE id_usuario = ?`, [userId]);
        const [reports] = await pool.query(`SELECT * FROM reporte_denuncia WHERE id_usuario = ?`, [userId]);
        const [losts] = await pool.query(`SELECT * FROM reporte_perdida WHERE id_usuario = ?`, [userId]);

        // Asegurarse de que la imagen se convierta a base64 si existe
        adoptions.forEach(pet => {
            if (pet.imagen) {
                pet.imagen = pet.imagen.toString('base64');
            }
        });

        return res.json({ adoptions, reports, losts });
    } catch (error) {
        console.error("Error al obtener datos del usuario (getUserStuff):", error);
        return res.status(500).json({ message: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        let { id } = req.params;

        // Convertir el ID a entero para asegurar que sea un número válido
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID de usuario inválido." });
        }

        // Usar parámetros de consulta (?) para seguridad y evitar errores de sintaxis
        const [profile] = await pool.query(`SELECT * FROM usuario WHERE id_usuario = ?`, [userId]);

        if (profile.length === 0) {
            return res.status(404).json({ message: "Perfil de usuario no encontrado." });
        }

        // Si la foto de perfil es un BLOB y necesitas enviarla en base64
        // Asumiendo que 'foto_perfil' es la columna correcta para la imagen de perfil
        if (profile[0].foto_perfil) {
            profile[0].foto_perfil = profile[0].foto_perfil.toString('base64');
        }

        return res.json({ profile: profile[0] }); // Devolver el primer (y único) perfil encontrado
    } catch (error) {
        console.error("Error al obtener perfil del usuario (getUserProfile):", error);
        return res.status(500).json({ message: error.message });
    }
}

export const getTest = async (req, res) => {
    console.log("wep");
    console.log(req); 
    return res.json({ asdf: "asdf" });
}
