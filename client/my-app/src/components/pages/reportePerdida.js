import React, { useEffect } from 'react';
import '../../styles/reportePerdida.css';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import reportarPerdida from '../../api/reportePerdida.api.js';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import { getUserSession } from "../../functions/userSession";
import { FaPaw, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ReportarPerdida = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="reporte-perdida-page">
      <Navbar />
      <main className="reporte-perdida-container">
        <Formik
          initialValues={{
            id_usuario: user,
            nombre_mascota: "",
            especie_mascota: "",
            raza_mascota: "",
            descripcion_mascota: "",
            ubicacion_perdida: "",
            fecha_perdida: "",
            recompensa: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await reportarPerdida(values);
              alert('Reporte registrado con éxito');
              navigate('/home');
            } catch (error) {
              console.error(error);
              alert('Error al registrar el reporte');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="reporte-form">
              <div className="form-header">
                <FaPaw className="form-icon" />
                <h1>Reportar Mascota Perdida</h1>
                <p>Por favor completa todos los campos para ayudarnos a encontrar a tu mascota</p>
              </div>

              <div className="form-group">
                <label htmlFor="nombre_mascota">Nombre de tu mascota</label>
                <input 
                  id="nombre_mascota"
                  name="nombre_mascota"
                  type="text"
                  onChange={handleChange}
                  placeholder="Ej: Max, Luna, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="especie_mascota">Especie</label>
                <select
                  id="especie_mascota"
                  name="especie_mascota"
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="raza_mascota">Raza</label>
                <input
                  id="raza_mascota"
                  name="raza_mascota"
                  type="text"
                  onChange={handleChange}
                  placeholder="Ej: Labrador, Siames, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion_mascota">Descripción</label>
                <textarea
                  id="descripcion_mascota"
                  name="descripcion_mascota"
                  onChange={handleChange}
                  placeholder="Rasgos únicos, color, tamaño, collar, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ubicacion_perdida">
                  <FaMapMarkerAlt /> Último lugar visto
                </label>
                <input
                  id="ubicacion_perdida"
                  name="ubicacion_perdida"
                  type="text"
                  onChange={handleChange}
                  placeholder="Calle, colonia, punto de referencia..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha_perdida">
                  <FaCalendarAlt /> Fecha de pérdida
                </label>
                <input
                  id="fecha_perdida"
                  name="fecha_perdida"
                  type="date"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="recompensa">
                  <FaMoneyBillWave /> Recompensa (opcional)
                </label>
                <div className="input-with-symbol">
                  <span>$</span>
                  <input
                    id="recompensa"
                    name="recompensa"
                    type="number"
                    onChange={handleChange}
                    placeholder="Cantidad en MXN"
                    min="0"
                  />
                </div>
              </div>

              <input type="hidden" id="id_usuario" name="id_usuario" value={user} />

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => navigate('/home')}
                >
                  <FaTimes /> Cancelar
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <FaPaperPlane /> {isSubmitting ? 'Enviando...' : 'Reportar Pérdida'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </main>
      <Footer />
    </div>
  );
};

export default ReportarPerdida;