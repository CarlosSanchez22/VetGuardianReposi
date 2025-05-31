import React from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import loginUser from '../../api/login.api'; // Asegúrate de que esta función llama a tu backend correctamente
import { saveUserSession } from '../../functions/userSession.js'; // Necesitaremos esta función para guardar el user completo

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <h1>Veterinaria "VETGUARDIAN"</h1>
          <p>Bienvenido de vuelta a nuestro sistema veterinario</p>
        </header>

        <div className="login-card">
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              try {
                const response = await loginUser(values); // Esta es la llamada a tu API
                
                // Desestructuramos para obtener 'token' y el objeto 'user' de la respuesta del backend
                const { token, user } = response.data; 

                // Guardar el token y el objeto de usuario completo en sessionStorage
                // La función saveUserSession debe manejar el almacenamiento de ambos
                saveUserSession(token, user); 

                // *** Lógica de Redirección basada en el rol del usuario ***
                if (user && user.role === 'admin') {
                    navigate('/admin/dashboard'); // Redirigir al dashboard de administrador
                } else {
                    navigate('/'); // Redirigir a la página principal para usuarios normales
                }

              } catch (error) {
                setFieldError('password', 'Credenciales incorrectas');
                // Mostrar un mensaje de error más específico si viene del backend
                if (error.response?.data?.message) { 
                  alert(error.response.data.message); 
                } else if (error.response) {
                  alert('Correo o contraseña incorrectos'); // Mensaje genérico si no hay data.message
                } else {
                  console.error("Error inesperado:", error);
                  alert('Error al iniciar sesión');
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting, errors }) => (
              <Form onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>
                
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    // El placeholder es 'tucorreo@ejemplo.com' en el código original, lo mantengo.
                    placeholder="tucorreo@ejemplo.com" 
                    required
                    className={errors.password ? 'error-input' : ''}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    className={errors.password ? 'error-input' : ''}
                  />
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                  
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </button>
                </div>

                <div className="additional-options">
                  <Link to="/forgot-password" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                  </Link>
                  
                  <div className="register-link">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;