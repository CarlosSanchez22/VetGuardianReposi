import React, { useEffect, useState } from 'react';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import getUser from '../../api/seguimiento.api.js';
import { useNavigate } from 'react-router-dom';
import { getUserSession } from "../../functions/userSession";
import { FaPaw, FaSearch, FaExclamationTriangle, FaCalendarAlt, FaDog, FaCat } from 'react-icons/fa';
import '../../styles/seguimiento.css';

const Seguimiento = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [navigate, user]);

  const [adoptionsUser, setAdoptions] = useState([]);
  const [lostsUser, setLosts] = useState([]);
  const [reportsUser, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { adoptions, losts, reports } = await getUser(JSON.parse(user));
        setAdoptions(adoptions);
        setLosts(losts);
        setReports(reports);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // Si hay error, devolver el string original
    }
  };

  return (
    <div className="seguimiento-page">
      <Navbar />
      <main className="seguimiento-container">
        <section className="section">
          <h1 className="section-title">
            <FaPaw /> Mis Adopciones
          </h1>
          {adoptionsUser.length > 0 ? (
            <div className="cards-container">
              {adoptionsUser.map((pet, index) => (
                <div key={`adoption-${index}`} className="pet-card">
                  <div className="pet-image-container">
                    {pet.imagen ? (
                      <img src={base64(pet.imagen)} alt={pet.nombre_mascota_adoptada} />
                    ) : (
                      <div className="pet-icon">
                        {pet.especie_mascota_adoptada === 'Perro' ? <FaDog /> : <FaCat />}
                      </div>
                    )}
                  </div>
                  <div className="pet-info">
                    <h2>{pet.nombre_mascota_adoptada}</h2>
                    <p><strong>Especie:</strong> {pet.especie_mascota_adoptada}</p>
                    <p><strong>Raza:</strong> {pet.raza_mascota_adoptada || 'No especificada'}</p>
                    <p><strong>Edad:</strong> {pet.edad_mascota_adoptada || 'No especificada'}</p>
                    <p><strong>Fecha de adopción:</strong> {formatDate(pet.fecha_adopcion)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No tienes adopciones registradas</p>
            </div>
          )}
        </section>

        <section className="section">
          <h1 className="section-title">
            <FaSearch /> Mascotas Perdidas
          </h1>
          {lostsUser.length > 0 ? (
            <div className="cards-container">
              {lostsUser.map((pet, index) => (
                <div key={`lost-${index}`} className="pet-card">
                  <div className="pet-info">
                    <h2>{pet.nombre_mascota || 'Mascota sin nombre'}</h2>
                    <p><strong>Descripción:</strong> {pet.descripcion_mascota}</p>
                    <p><strong>Especie:</strong> {pet.especie_mascota}</p>
                    <p><strong>Raza:</strong> {pet.raza_mascota || 'No especificada'}</p>
                    <p><strong>Fecha de pérdida:</strong> {formatDate(pet.fecha_perdida)}</p>
                    <p><strong>Recompensa:</strong> {pet.recompensa ? `$${pet.recompensa}` : 'No especificada'}</p>
                    <p><strong>Última ubicación:</strong> {pet.ubicacion_perdida}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No tienes mascotas perdidas reportadas</p>
            </div>
          )}
        </section>

        <section className="section">
          <h1 className="section-title">
            <FaExclamationTriangle /> Mis Reportes
          </h1>
          {reportsUser.length > 0 ? (
            <div className="cards-container">
              {reportsUser.map((report, index) => (
                <div key={`report-${index}`} className="report-card">
                  <div className="report-info">
                    <h2>Reporte #{index + 1}</h2>
                    <p><strong>Fecha del reporte:</strong> {formatDate(report.fecha_reporte)}</p>
                    <p><strong>Descripción del animal:</strong> {report.descripcion_animal}</p>
                    <p><strong>Descripción de los hechos:</strong> {report.descripcion_hechos}</p>
                    <p><strong>Dirección:</strong> {report.direccion}</p>
                    <p><strong>Estado:</strong> {report.estado || 'En revisión'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No tienes reportes registrados</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

function base64(image) {
  return `data:image/jpeg;base64,${image}`;
}

export default Seguimiento;