import { Router } from "express";
import { reportarPerdida } from "../controllers/reportePerdida.controllers.js";

const router = Router();

// Esta ruta se monta en '/reportePerdida' en index.js
// Por lo tanto, aquí es simplemente '/'
router.post('/', reportarPerdida); // <-- CORREGIDO

export default router;