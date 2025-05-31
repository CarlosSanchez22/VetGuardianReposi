// src/controllers/reporteDenuncia.controllers.js
import { pool } from '../db.js';

export const reportarDenuncia = async (req, res) => {
    try {
        // Desestructuramos para obtener el objeto 'id_usuario' y los otros campos directamente
        const { id_usuario, fecha_reporte, especie_animal, descripcion_hechos, descripcion_animal, direccion } = req.body;
    
        // Extraemos el ID numérico del objeto id_usuario recibido
        // Si id_usuario ya fuera un número, esto seguiría funcionando.
        const id_usuario_numerico = typeof id_usuario === 'object' && id_usuario !== null ? id_usuario.id_usuario : id_usuario;

        console.log("Datos recibidos (ajustados para DB): ", {
            id_usuario: id_usuario_numerico,
            fecha_reporte,
            especie_animal,
            descripcion_hechos,
            descripcion_animal,
            direccion
        });
    
        // Verificación de que todos los campos obligatorios están presentes y no son nulos o vacíos
        // Asegúrate de que id_usuario_numerico también se verifique si es obligatorio
        if (!id_usuario_numerico || !fecha_reporte || !especie_animal || !descripcion_hechos || !descripcion_animal || !direccion) {
            console.log("Faltan campos obligatorios para el reporte de denuncia.");
            return res.status(400).send('Faltan campos obligatorios para el reporte de denuncia.');
        }
    
        try {
            const result = await pool.query(
                'INSERT INTO reporte_denuncia (id_usuario, fecha_reporte, especie_animal, descripcion_hechos, descripcion_animal, direccion) VALUES (?, ?, ?, ?, ?, ?)',
                [id_usuario_numerico, fecha_reporte, especie_animal, descripcion_hechos, descripcion_animal, direccion]
            );
            console.log("Resultado de la inserción:", result);
            res.status(201).send('Reporte levantado con éxito'); // Usa 201 Created para éxito de creación
        } catch (error) {
            console.error("Error al subir el reporte a la base de datos:", error); // Mensaje más específico
            res.status(500).send('Error al subir el reporte a la base de datos.');
        } 
    } catch (error) {
        // Captura cualquier error que ocurra antes de la consulta SQL (ej. desestructuración)
        console.error("Error general en reportarDenuncia:", error);
        return res.status(500).json({ message: error.message });
    }
};