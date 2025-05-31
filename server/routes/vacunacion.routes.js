import { Router } from "express";
import { 
    getMascotasPendientesTratamiento, 
    getVeterinarios, 
    agendarCita 
} from "../controllers/vacunacion.controllers.js";

const router = Router();

// Estas rutas se montan en '/api/vacunacion' en index.js
// Por lo tanto, aquí deben ser relativas a ese prefijo
router.get("/pendientes/:idUsuario", getMascotasPendientesTratamiento); // <-- CORREGIDO
router.get("/veterinarios", getVeterinarios); // <-- CORREGIDO
router.post("/agendar-cita", agendarCita); // <-- CORREGIDO

export default router;