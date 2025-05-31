import { Router } from 'express';
import { 
    getAllUsers, createUser, updateUser, deleteUser,
    getUserPets, getUserReports,
    getAllMascotas, createMascota, updateMascota, deleteMascota,
    getAllLossReports, updateLossReportStatus,
    getAllComplaintReports, updateComplaintReportStatus,
    getAllCitas, updateCitaStatus
} from '../controllers/admin.controllers.js'; // Asegúrate de que los controladores estén correctamente importados

const router = Router();

// NOTA IMPORTANTE: Estas rutas se montan en '/api/admin' en index.js y ya pasan por verifyToken y isAdmin.
// Por ejemplo, la ruta router.get("/users") se accederá como GET /api/admin/users.
// No es necesario añadir verifyToken o isAdmin aquí, ya que se aplican al router completo en index.js.

// --- Rutas para la Gestión de Usuarios ---
router.get("/users", getAllUsers); 
router.post("/users", createUser); 
router.put("/users/:id_usuario", updateUser); // <-- Quitado /admin
router.delete("/users/:id_usuario", deleteUser); // <-- Quitado /admin
router.get("/users/:id_usuario/mascotas", getUserPets); // <-- Quitado /admin
router.get("/users/:id_usuario/reportes", getUserReports); // <-- Quitado /admin

// --- Rutas para la Gestión de Mascotas ---
router.get("/mascotas", getAllMascotas); // <-- Quitado /admin
router.post("/mascotas", createMascota);
router.put("/mascotas/:id_mascota", updateMascota); // <-- Quitado /admin
router.delete("/mascotas/:id_mascota", deleteMascota); // <-- Quitado /admin

// --- Rutas para la Gestión de Reportes de Pérdida ---
router.get("/reportes/perdida", getAllLossReports); // <-- Quitado /admin
router.put("/reportes/perdida/:id_reporte/status", updateLossReportStatus); // <-- Quitado /admin

// --- Rutas para la Gestión de Reportes de Denuncia ---
router.get("/reportes/denuncia", getAllComplaintReports); // <-- Quitado /admin
router.put("/reportes/denuncia/:id_reporte/status", updateComplaintReportStatus); // <-- Quitado /admin

// --- Rutas para la Gestión de Citas/Tratamientos ---
router.get("/citas", getAllCitas); // <-- Quitado /admin
router.put("/citas/:id_cita/status", updateCitaStatus); // <-- Quitado /admin

export default router;
