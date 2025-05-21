import React, { useEffect } from 'react';
import '../../styles/reporteDenuncia.css';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import reportarDenuncia from '../../api/reporteDenuncia.api.js';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import { getUserSession } from "../../functions/userSession";
import { FaExclamationTriangle, FaCalendarAlt, FaPaw, FaMapMarkerAlt, FaTimes, FaPaperPlane } from 'react-icons/fa';

const HacerDenuncia = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className='denuncia-page'>
      <Navbar />
      <main className='denuncia-container'>
        <Formik
          initialValues={{
            id_usuario: user,
            fecha_reporte: "",
            especie_animal: "",
            descripcion_hechos: "",
            descripcion_animal: "",
            direccion: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await reportarDenuncia(values);
              alert('Denuncia registrada con éxito');
              navigate('/home');
            } catch (error) {
              console.error(error);
              alert('Error al registrar la denuncia');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="denuncia-form">
              <div className="form-header">
                <FaExclamationTriangle className="form-icon" />
                <h1>Reportar Maltrato Animal</h1>
                <p>Tu denuncia puede salvar vidas. Por favor completa todos los campos.</p>
              </div>

              <div className="form-group">
                <label htmlFor="fecha_reporte">
                  <FaCalendarAlt /> Fecha del maltrato
                </label>
                <input
                  id='fecha_reporte'
                  name='fecha_reporte'
                  type="date"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="especie_animal">
                  <FaPaw /> Especie del animal
                </label>
                <select
                  id='especie_animal'
                  name='especie_animal'
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
                <label htmlFor="descripcion_animal">Descripción del animal</label>
                <input
                  id='descripcion_animal'
                  name='descripcion_animal'
                  type="text"
                  onChange={handleChange}
                  placeholder="Color, tamaño, características distintivas..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion_hechos">Descripción de los hechos</label>
                <textarea
                  id='descripcion_hechos'
                  name='descripcion_hechos'
                  onChange={handleChange}
                  placeholder="Describe en detalle lo que presenciaste..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion">
                  <FaMapMarkerAlt /> Ubicación exacta
                </label>
                <input
                  id='direccion'
                  name='direccion'
                  type="text"
                  onChange={handleChange}
                  placeholder="Calle, número, colonia, ciudad..."
                  required
                />
              </div>

              <input type="hidden" id='id_usuario' name='id_usuario' value={user} />

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
                  <FaPaperPlane /> {isSubmitting ? 'Enviando...' : 'Enviar Denuncia'}
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

export default HacerDenuncia;