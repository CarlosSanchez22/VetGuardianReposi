import React from 'react';
import { Form, Formik } from 'formik';
import '../../styles/signup.css';
import registerUser from '../../api/register.api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  return (
    <div className="register-page">
      <div className="register-container">
        <header className="register-header">
          <h1>Veterinaria JohnS</h1>
          <p>Regístrate para acceder a nuestros servicios veterinarios</p>
        </header>
        
        <div className="register-card">
          <Formik
            initialValues={{
              name: "",
              lastname: "",
              email: "",
              password: "",
              phoneNumber: "",
              birthdate: "",
              hasPets: "",
            }}
            onSubmit={async (values) => {
              try {
                await registerUser(values);
                navigate('/Login');
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <h2>Crear una cuenta</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      onChange={handleChange} 
                      placeholder="Ingresa tu nombre"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastname">Apellidos</label>
                    <input 
                      type="text" 
                      id="lastname" 
                      name="lastname" 
                      onChange={handleChange} 
                      placeholder="Ingresa tus apellidos"
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    onChange={handleChange} 
                    placeholder="ejemplo@correo.com"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    onChange={handleChange} 
                    placeholder="Crea una contraseña segura"
                    required 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Teléfono</label>
                    <input 
                      type="tel" 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      onChange={handleChange} 
                      placeholder="Número de contacto"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="birthdate">Fecha de nacimiento</label>
                    <input 
                      type="date" 
                      id="birthdate" 
                      name="birthdate" 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="hasPets">¿Tienes mascotas?</label>
                  <select 
                    id="hasPets" 
                    name="hasPets" 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Si">Sí, tengo mascotas</option>
                    <option value="No">No tengo mascotas</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                  </button>
                  
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </button>
                </div>
                
                <div className="login-link">
                  ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;