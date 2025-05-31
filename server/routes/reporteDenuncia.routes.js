import { Router } from "express";
import { reportarDenuncia } from "../controllers/reporteDenuncia.controllers.js";

const router = Router();

// Esta ruta se monta en '/reporteDenuncia' en index.js
// Por lo tanto, aquí es simplemente '/'
router.post('/', reportarDenuncia); // <-- CORREGIDO

export default router;