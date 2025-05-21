import React, { useState } from 'react';
import '../../styles/RegistrarAnimal.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import { FaPaw, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import darAdopcion from '../../api/darAdopcion.api.js'; // Importación añadida

const RegistrarAnimal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    especie: "",
    raza: "",
    esta_esterilizado: "si",
    esta_vacunado: "si",
    descripcion: "",
    foto_mascota: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto_mascota: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      await darAdopcion(formData);
      navigate("/mascotas");
    } catch (error) {
      console.error(error);
      alert("Error al registrar la mascota");
    }
  };

  return (
    <div className="register-animal-page">
      <Navbar />
      <main className="register-animal-container">
        <form onSubmit={handleSubmit} className="animal-form">
          <div className="form-header">
            <FaPaw className="form-icon" />
            <h1>Dar mascota en adopción</h1>
            <p>Completa el formulario para ayudar a encontrar un hogar</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del animal</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Luna, Max, etc."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="especie">Especie</label>
              <select
                id="especie"
                name="especie"
                value={form.especie}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="raza">Raza</label>
              <input
                id="raza"
                name="raza"
                type="text"
                value={form.raza}
                onChange={handleChange}
                placeholder="Ej: Labrador, Siames, etc."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edad">Edad aproximada</label>
              <input
                id="edad"
                name="edad"
                type="text"
                value={form.edad}
                onChange={handleChange}
                placeholder="Ej: 2 años, 6 meses"
                required
              />
            </div>

            <div className="form-group">
              <label>Estado médico</label>
              <div className="medical-status">
                <div className="status-option">
                  <label htmlFor="esta_esterilizado">Esterilizado/Castrado</label>
                  <div className="toggle-options">
                    <button
                      type="button"
                      className={`toggle-btn ${form.esta_esterilizado === 'si' ? 'active' : ''}`}
                      onClick={() => setForm({...form, esta_esterilizado: 'si'})}
                    >
                      <FaCheck /> Sí
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${form.esta_esterilizado === 'no' ? 'active' : ''}`}
                      onClick={() => setForm({...form, esta_esterilizado: 'no'})}
                    >
                      <FaTimes /> No
                    </button>
                  </div>
                </div>

                <div className="status-option">
                  <label htmlFor="esta_vacunado">Vacunado</label>
                  <div className="toggle-options">
                    <button
                      type="button"
                      className={`toggle-btn ${form.esta_vacunado === 'si' ? 'active' : ''}`}
                      onClick={() => setForm({...form, esta_vacunado: 'si'})}
                    >
                      <FaCheck /> Sí
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${form.esta_vacunado === 'no' ? 'active' : ''}`}
                      onClick={() => setForm({...form, esta_vacunado: 'no'})}
                    >
                      <FaTimes /> No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="descripcion">Descripción general</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe su personalidad, hábitos, necesidades especiales..."
                rows="4"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="foto_mascota">Foto de la mascota</label>
              <div className={`file-upload ${previewImage ? 'has-image' : ''}`}>
                {previewImage ? (
                  <div className="image-preview">
                    <img src={previewImage} alt="Preview" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => {
                        setPreviewImage(null);
                        setForm({...form, foto_mascota: null});
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <>
                    <FaUpload className="upload-icon" />
                    <input 
                      id="foto_mascota"
                      name="foto_mascota"
                      type="file" 
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                    />
                    <p>Arrastra o selecciona una imagen</p>
                    <span>Formatos: JPG, PNG (Max. 5MB)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/mascotas')}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Registrar para adopción
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RegistrarAnimal;