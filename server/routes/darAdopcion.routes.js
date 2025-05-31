// src/routes/darAdopcion.routes.js
// Este archivo maneja la ruta para que un usuario registre una mascota para ser DADA en adopción.

import { Router } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Importa la función darAdopcion desde su controlador
import { darAdopcion } from '../controllers/darAdopcion.controllers.js';

const router = Router();

// Ruta para registrar una mascota para dar en adopción
router.post("/darAdopcion", upload.single('foto_mascota'), darAdopcion);

// ELIMINA COMPLETAMENTE LAS SIGUIENTES RUTAS SI ESTÁN PRESENTES EN ESTE ARCHIVO:
/*
router.post('/api/registro_usuario', upload.single('fotoPerfil'), async (req, res) => {
    // ... (código de registro de usuario) ...
});

router.get('/api/obtener_usuario/:id', async (req, res) => {
    // ... (código de obtención de usuario) ...
});

router.post("/adoptar ", (req, res) => { // ¡Este tiene un espacio al final!
    // ... (código de adopción conflictivo) ...
});
*/

export default router;