import axios from 'axios';

// Crea una instancia de Axios con la URL base de tu backend
const api = axios.create({
  baseURL: 'http://localhost:4000', // Asegúrate de que esta sea la URL base de tu servidor Express
  // Puedes añadir otros headers por defecto si los necesitas, ej:
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Añade un interceptor de solicitud
// Este interceptor se ejecutará antes de que cada petición se envíe
api.interceptors.request.use(
  (config) => {
    // Obtiene el token JWT de sessionStorage
    const token = sessionStorage.getItem('authToken'); 

    // Si existe un token, lo añade al encabezado 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Maneja los errores de la solicitud (ej. si no se puede obtener el token)
    return Promise.reject(error);
  }
);

export default api; // Exporta la instancia configurada de Axios
