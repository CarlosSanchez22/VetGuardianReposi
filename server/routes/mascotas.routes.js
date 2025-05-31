// src/routes/mascotas.routes.js
// Este archivo maneja las rutas para el listado general y CRUD de mascotas.

import { Router } from 'express'
import {
    getMascotas,
    getMascota,
    createMascotas,
    updateMascota,
    deleteMascota
} from '../controllers/mascotas.controllers.js'
// Estas importaciones y rutas de usuario IDEALMENTE deberían ir en un archivo user.routes.js separado.
import { getTest, getUserStuff, getUserProfile } from '../controllers/user.controller.js'; 

const router = Router();

// Rutas de mascotas
router.get('/mascotas', getMascotas);
// ELIMINA LA LÍNEA DUPLICADA: router.get('/mascotas', getMascotas);
router.get('/mascotas/:id', getMascota);
router.post('/mascotas', createMascotas);
router.put('/mascotas/:id', updateMascota);
router.delete('/mascotas/:id', deleteMascota);

// Rutas de usuario (MANTENIDAS AQUÍ TEMPORALMENTE para evitar reestructuración masiva)
router.get('/test', getTest);
router.get('/seguimiento/:id', getUserStuff);
router.get('/perfil/:id', getUserProfile);

export default router;