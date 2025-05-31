import { Router } from "express";
import { createUser } from "../controllers/signup.controllers.js"; // <-- Asegúrate de importar getUserStuff

const router = Router();

// Ruta para crear un nuevo usuario (registro) - esta es pública
router.post('/users', createUser); 


export default router;
