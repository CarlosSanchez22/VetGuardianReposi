// src/controllers/reportePerdida.controllers.js
import { pool } from '../db.js';

export const reportarPerdida = async (req, res) => {
    try {
        // Desestructuramos para obtener el objeto 'id_usuario' y los otros campos
        const { 
            id_usuario, // Esto será el objeto completo del usuario
            nombre_mascota, 
            especie_mascota, 
            raza_mascota, 
            descripcion_mascota, 
            ubicacion_perdida, 
            fecha_perdida, 
            recompensa 
        } = req.body;
    
        // Extraemos el ID numérico del objeto id_usuario recibido
        // Esta línea es crucial y es la misma lógica que usamos para reporteDenuncia
        const id_usuario_numerico = typeof id_usuario === 'object' && id_usuario !== null ? id_usuario.id_usuario : id_usuario;

        console.log("Datos recibidos (ajustados para DB): ", {
            id_usuario: id_usuario_numerico, // Aquí vemos el ID numérico
            nombre_mascota, 
            especie_mascota, 
            raza_mascota, 
            descripcion_mascota, 
            ubicacion_perdida, 
            fecha_perdida, 
            recompensa 
        });
    
        // Verificación de campos obligatorios (asegurando que id_usuario_numerico también se verifique)
        if (
            !id_usuario_numerico || 
            !nombre_mascota || 
            !especie_mascota || 
            !raza_mascota || 
            !descripcion_mascota || 
            !ubicacion_perdida || 
            !fecha_perdida || 
            recompensa === undefined || recompensa === null // Es mejor verificar 'undefined' o 'null' para números
        ) {
            console.log("Faltan campos obligatorios para el reporte de pérdida.");
            return res.status(400).send('Faltan campos obligatorios para el reporte de pérdida.'); 
        }
    
        try {
            const result = await pool.query(
                'INSERT INTO reporte_perdida (id_usuario, nombre_mascota, especie_mascota, raza_mascota, descripcion_mascota, ubicacion_perdida, fecha_perdida, recompensa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    id_usuario_numerico, // Aquí pasamos el ID numérico
                    nombre_mascota, 
                    especie_mascota, 
                    raza_mascota, 
                    descripcion_mascota, 
                    ubicacion_perdida, 
                    fecha_perdida, 
                    recompensa
                ]
            );
            console.log("Resultado de la inserción:", result);
            res.status(201).send('Reporte de pérdida registrado con éxito'); // Usamos 201 Created
        } catch (error) {
            console.error("Error al registrar el reporte de pérdida en la base de datos:", error); 
            res.status(500).send('Error al registrar el reporte de pérdida en la base de datos.');
        } 
    } catch (error) {
        // Captura cualquier error que ocurra antes de la consulta SQL
        console.error("Error general en reportarPerdida:", error);
        return res.status(500).json({ message: error.message });
    }
}