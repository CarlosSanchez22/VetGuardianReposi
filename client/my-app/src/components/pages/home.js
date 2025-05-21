import React, { useEffect } from 'react';
import '../../styles/Home.css';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import { getUserSession } from "../../functions/userSession";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="home-page">
      <Navbar/>
      
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Veterinaria JohnS</h1>
          <p className="hero-subtitle">El centro de adopción más grande del país</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/mascotas')}>Adoptar</button>
            <button className="secondary-btn" onClick={() => navigate('/reportePerdida')}>Reportar</button>
          </div>
        </div>
        <div className="hero-overlay"></div>
        <img 
          src={`${process.env.PUBLIC_URL}/assets/perroGato.png`} 
          alt="Perro y gato juntos" 
          className="hero-image" 
        />
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-header">
          <h2>Conoce un poco más sobre nosotros</h2>
          <p className="section-subtitle">Nuestra misión es crear un mundo mejor para los animales</p>
        </div>

        <div className="cards-container">
          <div className="about-card">
            <div className="card-icon">🐾</div>
            <h3>¿Quiénes somos?</h3>
            <p>
              Somos un grupo de personas apasionadas por los animales, dedicadas a rescatar, 
              proteger y encontrar hogares amorosos para mascotas necesitadas.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">🎯</div>
            <h3>Nuestro objetivo</h3>
            <p>
              Construir el refugio más grande del país para acoger a miles de animales 
              en situación de calle y encontrarles una familia para siempre.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">🤝</div>
            <h3>¿Cómo ayudar?</h3>
            <p>
              Adopta, reporta animales en peligro o perdidos, haz donaciones o 
              conviértete en voluntario. ¡Cada acción cuenta!
            </p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;