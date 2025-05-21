import React, { useEffect, useState } from 'react';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import getUserProfile from '../../api/perfil.api.js';
import { getUserSession } from '../../functions/userSession.js';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  const [userProfile, setUserProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { profile } = await getUserProfile(user);
        setUserProfile(profile[0]);
        setFormData({
          nombre: profile[0]?.nombre || '',
          apellidos: profile[0]?.apellidos || '',
          correo: profile[0]?.correo || '',
          telefono: profile[0]?.telefono || '',
          cumpleanos: profile[0]?.cumpleaños?.split("T")[0] || ''
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchData();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí iría la llamada a la API para actualizar el perfil
      // await updateProfile(user, formData);
      setUserProfile({
        ...userProfile,
        ...formData
      });
      setIsEditing(false);
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Error al actualizar el perfil');
    }
  };

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
      return dateString;
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <div className="profile-header">
          <h1><FaUser /> Perfil de Usuario</h1>
          <div className="profile-actions">
            <button 
              onClick={handleEditToggle}
              className="edit-button"
            >
              <FaEdit /> {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="logout-button"
            >
              <FaSignOutAlt /> Cerrar Sesión
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Información Personal</h2>
              <div className="form-group">
                <label htmlFor="nombre">Nombres</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Información de Contacto</h2>
              <div className="form-group">
                <label htmlFor="correo"><FaEnvelope /> Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono"><FaPhone /> Número Telefónico</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cumpleanos"><FaBirthdayCake /> Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="cumpleanos"
                  name="cumpleanos"
                  value={formData.cumpleanos}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="save-button">Guardar Cambios</button>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <h2>Información Personal</h2>
              <div className="info-field">
                <span className="field-title">Nombres</span>
                <span className="field-value">{userProfile.nombre || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="field-title">Apellidos</span>
                <span className="field-value">{userProfile.apellidos || 'No especificado'}</span>
              </div>
            </div>

            <div className="info-section">
              <h2>Información de Contacto</h2>
              <div className="info-field">
                <span className="field-title"><FaEnvelope /> Correo Electrónico</span>
                <span className="field-value">{userProfile.correo || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="field-title"><FaPhone /> Número Telefónico</span>
                <span className="field-value">{userProfile.telefono || 'No especificado'}</span>
              </div>
              <div className="info-field">
                <span className="field-title"><FaBirthdayCake /> Fecha de Nacimiento</span>
                <span className="field-value">{formatDate(userProfile.cumpleaños)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Perfil;