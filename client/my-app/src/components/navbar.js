import React from 'react';
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../functions/logout';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home">
            <span className="brand-logo">Veterinaria</span>
            <span className="brand-name">JohnS</span>
          </Link>
        </div>
        
        <div className="navbar-main">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/mascotas" className="nav-link">
                <i className="nav-icon">🐾</i>
                <span>Adoptar</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reporteDenuncia" className="nav-link">
                <i className="nav-icon">⚠️</i>
                <span>Denunciar</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reportePerdida" className="nav-link">
                <i className="nav-icon">🔍</i>
                <span>Reportar extravío</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/vacunacion" className="nav-link">
                <i className="nav-icon">💉</i>
                <span>Vacunación</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/seguimiento" className="nav-link">
                <i className="nav-icon">📊</i>
                <span>Seguimiento</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="navbar-actions">
          <Link to="/perfil" className="profile-link">
            <i className="profile-icon">👤</i>
            <span>Tu Perfil</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <i className="logout-icon">🚪</i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;