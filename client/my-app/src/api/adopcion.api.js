import api from './axiosConfig'; 

// Obtener mascotas para la vista de adopciones
const verAdopciones = async () => {
  // Usar 'api' y ruta relativa (baseURL ya es 'http://localhost:4000')
  const response = await api.get("/mascotas"); 
  return response.data;
};

// Adoptar una mascota
const adoptarMascota = async (id_usuario, id_mascota) => {
  // Usar 'api' y ruta relativa
  await api.post("/adoptar", { id_usuario, id_mascota });
};

// Las funciones getUserInfo y getUserProfile no están exportadas y parecen redundantes/mal definidas
// para esta API, ya que adoptan la misma ruta de adopción y no tienen uso claro aquí.
// Si las necesitas, deberían usar 'api' y rutas correctas para obtener información de usuario/perfil.
// Por ahora, las comentamos o eliminamos si no son relevantes para la adopción.
/*
const getUserInfo= async (id_usuario) => {
  await api.get("/adoptar", { // Esto es extraño, /adoptar es para POST, no GET de info de usuario
    params: {
      id_usuario: id_usuario,
    }
  });
};

const getUserProfile= async (id_usuario) => {
  await api.get("/adoptar", { // Esto es extraño, /adoptar es para POST, no GET de perfil de usuario
    params: {
      id_usuario: id_usuario,
    }
  });
};
*/

export { verAdopciones, adoptarMascota };
