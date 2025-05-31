import express from "express";
// Solo importa 'mascotas', ya que es lo único que exporta tu controlador de adopción actualmente.
import { adoptarMascotaController } from "../controllers/adopcion.controllers.js"; 

const router = express.Router();

router.post("/", adoptarMascotaController); 

// Esta línea causaba el error porque 'adoptarMascotaController' no existe en tu controlador.
// La comentamos o eliminamos por ahora para que el backend pueda iniciar.
// router.post("/", adoptarMascotaController); 

export default router;