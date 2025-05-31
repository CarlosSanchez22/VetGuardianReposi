// src/controllers/darAdopcion.controllers.js
// Este archivo maneja la acción de DAR una mascota en adopción (registrarla).

import { pool } from "../db.js";

export const darAdopcion = async (req, res) => {
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

    const foto = req.file ? req.file.buffer : null;
    console.log("Datos recibidos para darAdopcion: ", req.body);

    try {
      await pool.query(
        "INSERT INTO mascotas (nombre, edad, especie, raza, esta_esterilizado, esta_vacunado, descripcion, foto_mascota, is_adopted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)", // Agrega is_adopted = 0 por defecto
        [
          nombre,
          edad,
          especie,
          raza,
          esta_esterilizado,
          esta_vacunado,
          descripcion,
          foto,
        ]
      );
      res.status(201).send("Mascota Registrada con éxito para adopción");
    } catch (error) {
      console.error("Error al registrar mascota para adopción:", error);
      res.status(500).send("Error al registrar la mascota para adopción");
    }
  } catch (error) {
    console.error("Error general en darAdopcion (controller):", error);
    return res.status(500).json({ message: error.message });
  }
};

// ELIMINA COMPLETAMENTE LA SIGUIENTE FUNCIÓN SI ESTÁ PRESENTE:
/*
export const adoptar = async (req, res) => {
  // ... (código de adopción duplicado) ...
};
*/