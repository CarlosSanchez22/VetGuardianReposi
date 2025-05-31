import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
// Importar los middlewares de autenticación y autorización
// Confirmado por ti: el archivo se llama 'auth.js' y está en 'middleware'
import { verifyToken, isAdmin } from "./middleware/auth.js"; 

// Importar tus rutas existentes
import indexRoutes from "./routes/index.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";
import usersRoutes from "./routes/users.routes.js"; // Contiene createUser, por lo tanto es pública
import loginRoutes from "./routes/login.routes.js"; 
import adoptarRoutes from "./routes/adopcion.routes.js"; 
import darAdopcionRoutes from "./routes/darAdopcion.routes.js"; 
import reporteDenunciaRoutes from "./routes/reporteDenuncia.routes.js"; 
import reportePerdidaRoutes from "./routes/reportePerdida.routes.js" 
import vacunacionRoutes from "./routes/vacunacion.routes.js";
import adminRoutes from "./routes/admin.routes.js"; // Importar las nuevas rutas de administración

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para CORS: Asegúrate de que el encabezado 'Authorization' esté permitido
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Añadido 'Authorization'
    next();
});

// --- Rutas públicas (no requieren autenticación) ---
// Estas rutas son accesibles para cualquier usuario, incluso si no ha iniciado sesión.
app.use(indexRoutes);
app.use(loginRoutes); // La ruta de login debe ser pública para que los usuarios puedan iniciar sesión
app.use(mascotasRoutes); // Si la vista de todas las mascotas es pública
app.use(darAdopcionRoutes); // Si el formulario para dar en adopción es público
app.use(usersRoutes); // Contiene createUser (registro), por lo tanto debe ser pública

// --- Rutas de usuario que requieren autenticación (token JWT válido) ---
// Aplicar 'verifyToken' directamente a cada módulo de ruta con su base path.
// Esto asume que los routers en sus archivos definen rutas relativas a este base path.
// Por ejemplo, si adoptarRoutes tiene router.post('/', ...), entonces la ruta completa es /adoptar
app.use('/adoptar', verifyToken, adoptarRoutes);
app.use('/reporteDenuncia', verifyToken, reporteDenunciaRoutes);
app.use('/reportePerdida', verifyToken, reportePerdidaRoutes);
// La ruta de vacunación en el error era /api/vacunacion/pendientes/5, así que montamos el router en /api/vacunacion
app.use('/api/vacunacion', verifyToken, vacunacionRoutes); 

// --- Rutas de administración (requieren autenticación Y rol de administrador) ---
// Aplicar 'verifyToken' y 'isAdmin' a las rutas de administración.
// La ruta de admin en el error era /api/admin/users, así que montamos el router en /api/admin
app.use('/api/admin', verifyToken, isAdmin, adminRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
