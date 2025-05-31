import { pool } from "../db.js";

// NO DEBERÍA HABER NINGUNA OTRA FUNCIÓN AQUÍ, COMO 'mascotas'.
// Asegúrate de que solo esté adoptarMascotaController.

export const adoptarMascotaController = async (req, res) => {
  const { id_usuario, id_mascota } = req.body; 

  if (!id_usuario || !id_mascota) {
    return res.status(400).json({ message: "ID de usuario y ID de mascota son requeridos para la adopción." });
  }

  try {
    const [mascotaResult] = await pool.query(
      "SELECT id_mascota, is_adopted FROM mascotas WHERE id_mascota = ? AND is_adopted = 0", 
      [id_mascota]
    );

    if (mascotaResult.length === 0) {
      return res.status(404).json({ message: "Mascota no encontrada o ya adoptada." });
    }

    await pool.query(
      "INSERT INTO adopciones (id_usuario, id_mascota, fecha_adopcion) VALUES (?, ?, NOW())",
      [id_usuario, id_mascota]
    );

    await pool.query(
      "UPDATE mascotas SET is_adopted = 1 WHERE id_mascota = ?",
      [id_mascota]
    );

    res.status(200).json({ message: "Mascota adoptada con éxito." });

  } catch (error) {
    console.error("Error al registrar adopción en adopcion.controllers.js:", error);
    return res.status(500).json({ message: "Error interno del servidor al procesar la adopción." });
  }
};