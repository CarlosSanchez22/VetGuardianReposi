import { pool } from '../db.js'; // Asegúrate de que tu conexión a la BD sea exportada como 'pool'
import bcrypt from 'bcryptjs';

// --- 1. Gestión de Usuarios ---

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        // Excluimos la contraseña por seguridad en la respuesta
        const [rows] = await pool.query("SELECT id_usuario, nombre, apellidos, correo, telefono, cumpleaños, tiene_mascotas, role FROM usuario");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener usuarios." });
    }
};

// Crear un nuevo usuario (funcionalidad para el admin)
export const createUser = async (req, res) => {
    // Asegúrate de usar los nombres de columnas correctos: 'correo', 'contraseña', 'cumpleaños', 'tiene_mascotas'
    const { nombre, apellidos, correo, contraseña, telefono, cumpleaños, tiene_mascotas, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const [result] = await pool.query(
            "INSERT INTO usuario (nombre, apellidos, correo, contraseña, telefono, cumpleaños, tiene_mascotas, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, apellidos, correo, hashedPassword, telefono, cumpleaños, tiene_mascotas, role || 'user'] // Rol por defecto 'user' si no se especifica
        );
        res.status(201).json({ id_usuario: result.insertId, message: "Usuario creado exitosamente." });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        // Si el correo ya existe, MySQL dará un error de clave única
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }
        res.status(500).json({ message: "Error interno del servidor al crear usuario." });
    }
};

// Actualizar un usuario existente
export const updateUser = async (req, res) => {
    const { id_usuario } = req.params;
    // Asegúrate de usar los nombres de columnas correctos: 'correo', 'contraseña', 'cumpleaños', 'tiene_mascotas'
    const { nombre, apellidos, correo, contraseña, telefono, cumpleaños, tiene_mascotas, role } = req.body;
    try {
        let hashedPassword = null;
        if (contraseña) { // Si se proporciona una nueva contraseña, la hasheamos
            hashedPassword = await bcrypt.hash(contraseña, 10);
        }

        const updates = [];
        const values = [];

        if (nombre) { updates.push("nombre = ?"); values.push(nombre); }
        if (apellidos) { updates.push("apellidos = ?"); values.push(apellidos); }
        if (correo) { updates.push("correo = ?"); values.push(correo); }
        if (hashedPassword) { updates.push("contraseña = ?"); values.push(hashedPassword); } // Usar 'contraseña'
        if (telefono) { updates.push("telefono = ?"); values.push(telefono); }
        if (cumpleaños) { updates.push("cumpleaños = ?"); values.push(cumpleaños); }
        if (tiene_mascotas !== undefined) { updates.push("tiene_mascotas = ?"); values.push(tiene_mascotas); } // Puede ser un booleano o string
        if (role) { updates.push("role = ?"); values.push(role); }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron datos para actualizar." });
        }

        values.push(id_usuario); // Añadir el ID al final para la cláusula WHERE
        const [result] = await pool.query(
            `UPDATE usuario SET ${updates.join(', ')} WHERE id_usuario = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.json({ message: "Usuario actualizado exitosamente." });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar usuario." });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        // MUY IMPORTANTE: Antes de eliminar un usuario, considera las dependencias.
        // Si tienes FOREIGN KEYS en tu DB que usan ON DELETE RESTRICT o NO ACTION,
        // necesitarás eliminar primero los registros relacionados o configurar ON DELETE CASCADE en tu esquema.
        // EJEMPLO de borrado manual de dependencias si no usas CASCADE:
        await pool.query("DELETE FROM adopciones WHERE id_usuario = ?", [id_usuario]);
        await pool.query("DELETE FROM reporte_denuncia WHERE id_usuario = ?", [id_usuario]);
        await pool.query("DELETE FROM reporte_perdida WHERE id_usuario = ?", [id_usuario]);
        await pool.query("DELETE FROM citas_tratamientos WHERE id_usuario = ?", [id_usuario]); // Si id_usuario es FK

        const [result] = await pool.query("DELETE FROM usuario WHERE id_usuario = ?", [id_usuario]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar usuario." });
    }
};

// Obtener mascotas adoptadas por un usuario específico (a través de la tabla 'adopciones')
export const getUserPets = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT m.* FROM mascotas m
             JOIN adopciones a ON m.id_mascota = a.id_mascota
             WHERE a.id_usuario = ?`,
            [id_usuario]
        );
        // Convertir BLOB a Base64 si 'foto_mascota' es un campo BLOB
        rows.forEach(pet => {
            if (pet.foto_mascota) {
                pet.foto_mascota = pet.foto_mascota.toString('base64');
            }
        });
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener mascotas del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener mascotas del usuario." });
    }
};

// Obtener reportes (denuncia y perdida) de un usuario específico
export const getUserReports = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [lossReports] = await pool.query("SELECT * FROM reporte_perdida WHERE id_usuario = ?", [id_usuario]);
        const [complaintReports] = await pool.query("SELECT * FROM reporte_denuncia WHERE id_usuario = ?", [id_usuario]);
        res.json({ lossReports, complaintReports });
    } catch (error) {
        console.error("Error al obtener reportes del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener reportes del usuario." });
    }
};


// --- 2. Gestión de Mascotas (todas las mascotas en el sistema) ---

// Obtener todas las mascotas
export const getAllMascotas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM mascotas");
        rows.forEach(pet => {
            if (pet.foto_mascota) {
                pet.foto_mascota = pet.foto_mascota.toString('base64');
            }
        });
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener todas las mascotas:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener todas las mascotas." });
    }
};

// Crear una nueva mascota (funcionalidad para el admin)
export const createMascota = async (req, res) => {
    const { nombre, edad, especie, raza, esta_esterilizado, esta_vacunado, descripcion, peso, nombre_usuario, id_carnet_medico, is_adopted } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO mascotas (nombre, edad, especie, raza, esta_esterilizado, esta_vacunado, descripcion, peso, nombre_usuario, id_carnet_medico, is_adopted) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, edad, especie, raza, esta_esterilizado, esta_vacunado, descripcion, peso, nombre_usuario, id_carnet_medico, is_adopted]
        );
        res.status(201).json({ id_mascota: result.insertId, message: "Mascota creada exitosamente." });
    } catch (error) {
        console.error("Error al crear mascota:", error);
        res.status(500).json({ message: "Error interno del servidor al crear mascota." });
    }
};

// Actualizar una mascota existente
export const updateMascota = async (req, res) => {
    const { id_mascota } = req.params;
    // Campos que el admin podría querer actualizar de una mascota
    const { nombre, edad, especie, raza, esta_esterilizado, esta_vacunado, descripcion, peso, nombre_usuario, id_carnet_medico, is_adopted } = req.body;
    try {
        const updates = [];
        const values = [];

        if (nombre) { updates.push("nombre = ?"); values.push(nombre); }
        if (edad) { updates.push("edad = ?"); values.push(edad); }
        if (especie) { updates.push("especie = ?"); values.push(especie); }
        if (raza) { updates.push("raza = ?"); values.push(raza); }
        // Asegúrate de que los valores para 'esta_esterilizado' y 'esta_vacunado' sean 'si' o 'no'
        if (esta_esterilizado !== undefined) { updates.push("esta_esterilizado = ?"); values.push(esta_esterilizado); }
        if (esta_vacunado !== undefined) { updates.push("esta_vacunado = ?"); values.push(esta_vacunado); }
        if (descripcion) { updates.push("descripcion = ?"); values.push(descripcion); }
        if (peso) { updates.push("peso = ?"); values.push(peso); }
        if (nombre_usuario) { updates.push("nombre_usuario = ?"); values.push(nombre_usuario); }
        if (id_carnet_medico) { updates.push("id_carnet_medico = ?"); values.push(id_carnet_medico); }
        if (is_adopted !== undefined) { updates.push("is_adopted = ?"); values.push(is_adopted); }

        if (updates.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron datos para actualizar." });
        }

        values.push(id_mascota);
        const [result] = await pool.query(
            `UPDATE mascotas SET ${updates.join(', ')} WHERE id_mascota = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mascota no encontrada." });
        }
        res.json({ message: "Mascota actualizada exitosamente." });
    } catch (error) {
        console.error("Error al actualizar mascota:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar mascota." });
    }
};

// Eliminar una mascota
export const deleteMascota = async (req, res) => {
    const { id_mascota } = req.params;
    try {
        // Al igual que con los usuarios, maneja las dependencias primero.
        // Si id_mascota es FK en otras tablas (ej. adopciones, citas_tratamientos),
        // elimina o actualiza esos registros primero.
        await pool.query("DELETE FROM citas_tratamientos WHERE id_mascota = ?", [id_mascota]);
        await pool.query("DELETE FROM adopciones WHERE id_mascota = ?", [id_mascota]);
        // Si tu tabla 'carnet_medico' tiene FK a 'mascotas', también maneja eso.

        const [result] = await pool.query("DELETE FROM mascotas WHERE id_mascota = ?", [id_mascota]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mascota no encontrada." });
        }
        res.json({ message: "Mascota eliminada exitosamente." });
    } catch (error) {
        console.error("Error al eliminar mascota:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar mascota." });
    }
};


// --- 3. Gestión de Reportes de Pérdida ---

// Obtener todos los reportes de perdida
export const getAllLossReports = async (req, res) => {
    try {
        // Unir con 'usuario' para obtener detalles del reportante
        const [rows] = await pool.query(
            `SELECT rp.*, u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.correo AS usuario_correo
             FROM reporte_perdida rp
             JOIN usuario u ON rp.id_usuario = u.id_usuario`
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener reportes de perdida:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener reportes de perdida." });
    }
};

// Actualizar el estado de un reporte de perdida
export const updateLossReportStatus = async (req, res) => {
    const { id_reporte } = req.params;
    const { status } = req.body; // El nuevo estado (ej. 'pendiente', 'encontrado', 'cerrado')
    try {
        const [result] = await pool.query("UPDATE reporte_perdida SET status = ? WHERE id_reporte = ?", [status, id_reporte]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reporte de perdida no encontrado." });
        }
        res.json({ message: "Estado de reporte de perdida actualizado." });
    } catch (error) {
        console.error("Error al actualizar estado de reporte de perdida:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar estado de reporte de perdida." });
    }
};


// --- 4. Gestión de Reportes de Denuncia ---

// Obtener todos los reportes de denuncia
export const getAllComplaintReports = async (req, res) => {
    try {
        // Unir con 'usuario' para obtener detalles del reportante
        const [rows] = await pool.query(
            `SELECT rd.*, u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.correo AS usuario_correo
             FROM reporte_denuncia rd
             JOIN usuario u ON rd.id_usuario = u.id_usuario`
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener reportes de denuncia:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener reportes de denuncia." });
    }
};

// Actualizar el estado de un reporte de denuncia
export const updateComplaintReportStatus = async (req, res) => {
    const { id_reporte } = req.params;
    const { status } = req.body; // El nuevo estado (ej. 'pendiente', 'investigando', 'resuelto')
    try {
        const [result] = await pool.query("UPDATE reporte_denuncia SET status = ? WHERE id_reporte = ?", [status, id_reporte]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reporte de denuncia no encontrado." });
        }
        res.json({ message: "Estado de reporte de denuncia actualizado." });
    } catch (error) {
        console.error("Error al actualizar estado de reporte de denuncia:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar estado de reporte de denuncia." });
    }
};


// --- 5. Gestión de Citas/Tratamientos ---

// Obtener todas las citas
export const getAllCitas = async (req, res) => {
    try {
        // Unir con usuario, mascotas y veterinarios para obtener todos los detalles relevantes
        const [rows] = await pool.query(
            `SELECT 
                ct.*, 
                u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos,
                m.nombre AS mascota_nombre, m.especie AS mascota_especie,
                v.nombre AS veterinario_nombre, v.apellidos AS veterinario_apellidos, v.especialidad AS veterinario_especialidad
             FROM citas_tratamientos ct
             JOIN usuario u ON ct.id_usuario = u.id_usuario
             JOIN mascotas m ON ct.id_mascota = m.id_mascota
             JOIN veterinarios v ON ct.id_veterinario = v.id_veterinario`
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener todas las citas:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener todas las citas." });
    }
};

// Actualizar el estado de una cita
export const updateCitaStatus = async (req, res) => {
    const { id_cita } = req.params;
    const { estado } = req.body; // El nuevo estado (ej. 'Pendiente', 'Confirmada', 'Completada', 'Cancelada')
    try {
        // Tu columna para el estado de la cita es 'estado_cita'
        const [result] = await pool.query("UPDATE citas_tratamientos SET estado_cita = ? WHERE id_cita = ?", [estado, id_cita]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cita no encontrada." });
        }
        res.json({ message: "Estado de cita actualizado exitosamente." });
    } catch (error) {
        console.error("Error al actualizar estado de cita:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar estado de cita." });
    }
};