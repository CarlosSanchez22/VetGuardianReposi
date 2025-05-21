import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contacto</h3>
          <div className="contact-info">
            <span role="img" aria-label="Teléfono" className="footer-icon">📞</span>
            <p>01 800 699 0000</p>
          </div>
          <div className="contact-info">
            <span role="img" aria-label="Email" className="footer-icon">✉️</span>
            <p>contacto@vetGUARDIAN.com</p>
          </div>
          <div className="contact-info">
            <span role="img" aria-label="Ubicación" className="footer-icon">📍</span>
            <p>Paseo de Reforma #7855, CDMX</p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Horario</h3>
          <p>Lunes a Viernes: 9:00 - 20:00</p>
          <p>Sábados: 10:00 - 18:00</p>
          <p>Domingos: Emergencias 24/7</p>
        </div>

        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="https://facebook.com" aria-label="Facebook">Facebook</a>
            <span> | </span>
            <a href="https://instagram.com" aria-label="Instagram">Instagram</a>
            <span> | </span>
            <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
          </div>
          <p>¡Conoce nuestras historias de rescate!</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Veterinaria JohnS. Todos los derechos reservados.</p>
        <p>Términos y condiciones | Política de privacidad</p>
      </div>
    </footer>
  );
};

export default Footer;