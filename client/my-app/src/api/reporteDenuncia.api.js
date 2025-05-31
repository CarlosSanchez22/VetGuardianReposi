import api from './axiosConfig'; 

const Denuncia = async (denuncia) => {
  // Usar 'api' y ruta relativa
  await api.post("/reporteDenuncia", denuncia);
};

export default Denuncia;