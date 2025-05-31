import api from './axiosConfig'; 

const Perdida = async (perdida) => {
  // Usar 'api' y ruta relativa
  await api.post("/reportePerdida", perdida);
};

export default Perdida;