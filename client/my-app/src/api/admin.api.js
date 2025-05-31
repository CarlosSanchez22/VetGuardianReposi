import api from './axiosConfig'; 

// --- Funciones para la Gestión de Usuarios ---

export const fetchAllUsers = async () => {
    try {
        const response = await api.get('/api/admin/users');
        return response.data;
    } catch (error) {
        console.error("Error al obtener todos los usuarios (admin):", error);
        throw error;
    }
};

export const createUserAdmin = async (userData) => { // Función para que el admin cree usuarios
    try {
        const response = await api.post('/api/admin/users', userData);
        return response.data;
    } catch (error) {
        console.error("Error al crear usuario (admin):", error.response?.data || error.message);
        throw error;
    }
};

export const updateUserAdmin = async (id_usuario, userData) => {
    try {
        const response = await api.put(`/api/admin/users/${id_usuario}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario (admin):", error.response?.data || error.message);
        throw error;
    }
};

export const deleteUserAdmin = async (id_usuario) => {
    try {
        const response = await api.delete(`/api/admin/users/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar usuario (admin):", error.response?.data || error.message);
        throw error;
    }
};

export const fetchUserPetsAdmin = async (id_usuario) => {
    try {
        const response = await api.get(`/api/admin/users/${id_usuario}/mascotas`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener mascotas de usuario (admin):", error);
        throw error;
    }
};

export const fetchUserReportsAdmin = async (id_usuario) => {
    try {
        const response = await api.get(`/api/admin/users/${id_usuario}/reportes`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reportes de usuario (admin):", error);
        throw error;
    }
};

// --- Funciones para la Gestión de Mascotas ---

export const fetchAllMascotasAdmin = async () => {
    try {
        const response = await api.get('/api/admin/mascotas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener todas las mascotas (admin):", error);
        throw error;
    }
};

// Nueva función para crear una mascota
export const createMascotaAdmin = async (mascotaData) => {
    try {
        const response = await api.post('/api/admin/mascotas', mascotaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear mascota (admin):", error.response?.data || error.message);
        throw error;
    }
};

export const updateMascotaAdmin = async (id_mascota, mascotaData) => {
    try {
        const response = await api.put(`/api/admin/mascotas/${id_mascota}`, mascotaData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar mascota (admin):", error.response?.data || error.message);
        throw error;
    }
};

export const deleteMascotaAdmin = async (id_mascota) => {
    try {
        const response = await api.delete(`/api/admin/mascotas/${id_mascota}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar mascota (admin):", error.response?.data || error.message);
        throw error;
    }
};

// --- Funciones para la Gestión de Reportes de Pérdida ---

export const fetchAllLossReportsAdmin = async () => {
    try {
        const response = await api.get('/api/admin/reportes/perdida');
        return response.data;
    } catch (error) {
        console.error("Error al obtener reportes de pérdida (admin):", error);
        throw error;
    }
};

export const updateLossReportStatusAdmin = async (id_reporte, status) => {
    try {
        const response = await api.put(`/api/admin/reportes/perdida/${id_reporte}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado de reporte de pérdida (admin):", error.response?.data || error.message);
        throw error;
    }
};

// --- Funciones para la Gestión de Reportes de Denuncia ---

export const fetchAllComplaintReportsAdmin = async () => {
    try {
        const response = await api.get('/api/admin/reportes/denuncia');
        return response.data;
    } catch (error) {
        console.error("Error al obtener reportes de denuncia (admin):", error);
        throw error;
    }
};

export const updateComplaintReportStatusAdmin = async (id_reporte, status) => {
    try {
        const response = await api.put(`/api/admin/reportes/denuncia/${id_reporte}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado de reporte de denuncia (admin):", error.response?.data || error.message);
        throw error;
    }
};

// --- Funciones para la Gestión de Citas/Tratamientos ---

export const fetchAllCitasAdmin = async () => {
    try {
        const response = await api.get('/api/admin/citas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener todas las citas (admin):", error);
        throw error;
    }
};

export const updateCitaStatusAdmin = async (id_cita, estado) => {
    try {
        const response = await api.put(`/api/admin/citas/${id_cita}/status`, { estado });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado de cita (admin):", error.response?.data || error.message);
        throw error;
    }
};
