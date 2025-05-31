import api from './axiosConfig'; // Asegúrate de que la ruta sea correcta

// Obtener mascotas adoptadas por un usuario que necesitan tratamiento
export const fetchMascotasPendientes = async (idUsuario) => {
    try {
        // Usar 'api' en lugar de 'axios' y la ruta completa (sin API_URL)
        const response = await api.get(`/api/vacunacion/pendientes/${idUsuario}`); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener mascotas pendientes:", error);
        throw error;
    }
};

// Obtener la lista de veterinarios
export const fetchVeterinarios = async () => {
    try {
        // Usar 'api' en lugar de 'axios' y la ruta completa
        const response = await api.get(`/api/vacunacion/veterinarios`); 
        return response.data;
    } catch (error) {
        console.error("Error al obtener veterinarios:", error);
        throw error;
    }
};

// Agendar una nueva cita de tratamiento
export const agendarCita = async (citaData) => {
    try {
        // Usar 'api' en lugar de 'axios' y la ruta completa
        const response = await api.post(`/api/vacunacion/agendar-cita`, citaData); 
        return response.data;
    } catch (error) {
        console.error("Error al agendar la cita:", error.response?.data || error.message);
        throw error;
    }
};
