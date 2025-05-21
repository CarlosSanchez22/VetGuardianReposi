import React from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import loginUser from '../../api/login.api';

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
                const response = await loginUser(values);
                sessionStorage.setItem("id_usuario", response.data.id);
                sessionStorage.setItem("role", response.data.role);
                navigate('/home');
              } catch (error) {
                setFieldError('password', 'Credenciales incorrectas');
                if (error.response?.data || error.response) {
                  alert('Correo o contraseña incorrectos');
                } else {
                  console.error(error);
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